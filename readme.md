# Sigma Stream

An API Service for limiting concurrent streams allowed per user.

## Deployment

I intended deploying this service to AWS EKS using the manifests present in the root directory but I think I ran out of AWS Quota and couldn't spin up an EC2 container to use as a node for the cluster.

### Assumptions

One assumption here is that a user is allowed to use their account on different devices as well as stream the same content on these devices at the same time with each counting towards their concurrent stream limit. This is a very common use case for streaming services.

### Design

Two endpoints are exposed by the service:

- `PUT /stream/:userId/:streamId - Register a stream` expected to be called when a user starts streaming a video.
  This endpoint implements a transactional write using DynamoDB conditional update ensuring that an append doesn't happen once a user's strem list is over the limit of 3 while avoiding the occurence of race conditions.
- `DELETE /stream/:userId/:streamId - Unregister a stream` expected to be called when a user stops streaming a video.
  This is a little more delicate than the above condering that DynamoDB's transaction implements an either or logic such that it's either a write transaction or a read transaction. No way to combine both. So, the approach here shift to using the idea behind optimistic locking using versioning. The version is incremented on every write and when a removal update is to be done, the version is checked using DynamoDB's conditional update to ensure that the version hasn't changed since the last read. This ensures that the removal update is done on the latest version of the stream list.

  If there happens to have been a version change, the operation fails and currently nothing is being done to handle retries. This is something that can be improved upon depending on the use case.

  With the version increament on every write, we are forced to think of the `max_safe_integer` limit present on DynamoDB.

  > DynamoDB attribute of type Number can store numbers up to 38 digits of precision.

  Even in the presence of a million RPS to perform a write operation, the service will still be good to version safely with precision for hundreds of years.

You can also find a Postman collection for the endpoints here [SigmaStream.postman_collection.json](https://documenter.getpostman.com/view/11854111/2s83tFGWv7)

### Notes

I was facisnated by a part in the assessment that noted `using the least amount of frameworks (including dependencies)`. Unknowingly, I ended up building a testing and web framework of mine and while I already had plans of doing this in my free time some time in the future, it was quite exciting to demonstrate such understanding on this assessment.

I recently also worked with some of my friends to implement an Eventloop in Golang - building on top of primitive ideas from Javascript's. I'm currently playing around the concept of Futures (something like NodeJS' event emitters). An implementation would be like

```go
package main

import (
    "fmt"
    gp "https://github.com/alob-mtc/go-promise"
)

func main() {
    // create a new future
    f := gp.NewFuture()
    // register a future event - blocks the main routine until signaled
    f.RegisterComplete(func(data interface{}) {
        fmt.Printf("Future responded with: %s", data.(string))
    })
    // do some long running sorcery
    go func() {
        <-time.After(5 * time.Second)
        // signal the future event
        f.SignalComplete("Hello World")
    }()
}

```

Here's the repo containing our implementation https://github.com/alob-mtc/go-promise

## Installation

Clone the repository to your local machine and install the dependencies.

```bash
git clone https://github.com/opensaucerer/sigma-stream.git
cd sigma-stream
npm install
```

Load up the environment variables in the `.env` file using the `.env.example` as a guide.

```bash
cp .env.example .env
```

Build and run the application.

```bash
npm run build && npm run start
```

You can also run in a Docker container using the `Dockerfile` provided.

```bash
docker build -t sigma-stream .
docker run -p 3000:3000 sigma-stream
```

## Testing

Run the tests using the following command.

```bash
npm run test
```

## Improvements

I believe I can improve on the current testing framework I implemented as well as make the testing suite more robust...write tests for cases that will fail and test for cases that will pass.

I can also improve on the web framework, wrap it around functions that can be easily instantiated like in the case of express `const app = express()` and then `app.get()` and `app.post()` etc.

# Scaling to infinity?

> There are no best solutions, only best trade-offs.

### Preliminary

Horizontal scaling is the best way to go. Multiple instances of this service available in multiple regions to ensure high availability. Our database, DynamoDB, is also able to scale horizontally in this manner. The trade-off here would be the C in CAP theorem - sacrificing consistency for availability.

> DynamoDB is eventually consistent, the data is eventually consistent across all storage locations, usually within one second or less.

This is a good trade-off for our use case as we are not dealing with sensitive data. The introduction of a global cache layer would also help ensure that this few seconds of inconsistency is not a problem. We can also use DynamoDB's auto-scaling feature to ensure that we are not over-provisioning our database.

A geo-aware load balancer would be implemented to balance traffic across the different regions. This would also help ensure that the user is always routed to the closest region to them thus reducing latency.

Backups will be computed regularly and ready to be restored in the event of a disaster. This backups will be distributed across multiple racks, availability zones, and regions to ensure that we are not affected by a single region going down. We can over-scale our backups with a trade-off of cost.

## Logging and Monitoring

Currently, the framework implements a simple logging system that logs to the console. This can be easily extended to log to a file or a database. Ideally, this database would mean a datalake like AWS S3 which can then be later processed using tools like AWS Glue or AWS Athena to enable querying for generation of reports, dashboards and alerts, analytics etc.

For a more optimal experience on the end of the user, it is important that we do not hold on to the request much more than necessary as that can even become expensive. For this reason, the framework implements a `next()` function that can be used to execute, let's say, an operation of pushing the logs to a queue like AWS SQS (due to its message retainment). This queue can then be processed by a lambda function that pushes the logs to the datalake.

In the case of a million RPS, AWS SQS is able to:

> contain an unlimited number of messages with 120,000 limit for inflight (consumed but not yet acknowledged) messages.

This would be a more optimal solution as it would not block the main thread and would allow the user to continue using the service.

We can also approach monitoring using AWS CloudWatch to monitor the service and trigger alerts when the service is down or when the RPS is too high. We can also use AWS CloudWatch to monitor the logs and trigger alerts when there are specific errors. CloudWatch provides better observability and can help improve MTTR.

## Handling Security

Security involves thinking about things like TLS certificates, authentication, security headers, request logging, etc. We will begin with a global auth service built with industry standard encryption and authentication methods that can be used to authenticate users and provide them with a signed token for continued access to every service. TLS certificates will be used to encrypt all traffic between the client and the service.

### DDoS and Load balancing with a reverse proxy

When we notice a particular user is making too many requests, we can blacklist their unique identifier in a global blacklist cache such that subsequent request by such identifier isn't processed by any service until after a particular grace period. This means our load balancer needs to be able to also serve as a reverse proxy. A Layer 7 load balancer is a reverse proxy as it handles requests on the application level and with this, we can enable some kind of authenitication and authorization at this level such that the identifier of the attacker is verified as being blacklisted before the request is even sent to the service. A leaky bucket or sliding window algorithm can be implemented for the purpose of this request limiting.
