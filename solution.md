# Apporch to the problem.
The first thing I did before typing any code, was making a quick sketch of the system that i wanted to implementer. This was a very rough and high level depection of the system. You can see this sketch in the figure below:
![alt text](image.png)

The idea with the data-streams services should be a hybrid services, both listing for incoming http-requests and function as a microservice, while the worker service is souly a Microservice. \\
I choose to use TCP as the Transport, to allow for communication between the Data-Streams and the Worker services. I chose TCP since it can provide high performance with low latency and high throughput, but TCP can also increase some complexity since you manually have to handle errors.

The message style I choose to use for the Transporter(s) (TCP Transport) in the application, is an event-based message style. The reason for this is that the worker class will have a work-loop that fetches the data from the external API every 5 min. Thus the Data-Streams service shouldn't just send one request with the start command to the worker and then wait for the worker to finish fetching the data from the external API, working with one response per. request. Rather it should send the start command to the worker, issuering it to start fetching data from the external API, and every time the worker is done fetching data it should emit an event telling the Data-streams service that it's done and ready to send the data back to the Data-streams service for storage. This will ensure that the Worker service can emit this event every 5 min. while still being able to resive other commands. Since the Worker service should also be able to emit events to the Data-Streams service, I also configured a clients module in `apps/worker/src/worker.module.ts` file.

For the data storage that the Data-Streams service uses I went with a relational database. I could also have used a cache or an in memory DB to get faster reads of the data, and only write the data to a disk in specified intervales as a backup, but since the idea is to persist data for longer periodes of times to provide valuable insights and analytics, i chode to stick to the relational database. The relational databse also makes it easy to group data that is related and categorise them through different tables and relations.
For the implementation of the bussiness logic related to the database i went with a Repository based implementation. I've therefore created a new module for the repository, that is imported in the AppModule, and implemented an Entity object (nobel.entity.ts) to model the tabel in the database that is used for stroing the data fetched in this problem. The repository module (`apps/data-streams/src/nobel/nobel.module.ts`) imports the  *TypeOrmModule* which is used to inject the repository into the `nobel.service.ts` class, which is then used for auto generating the queries to retriving and persisting the data.

# How to run
## Prerequrisits to run the application
- Node v. 20.12.7 or higher
- Mariadb (MySQL)

## Steps to run

1. Before running the application you have to create a Database (MariaDB) on your localmachine or some other place which the application can connect to, through the HttpModule which is imported and configured in the `apps/data-streams/src/app.module.ts` file.

### Creating the Database

- On your localmachine create a new database (ensure that your DBMS is MariaDB) since the application is configured to use this driver. When creating the database you should do following:
  1. The databse should be called **_dwhCodingInterview_**
     - If you wish to call it something else then remember to change the setting `database: '<your database name>'` under the AppModule's class under `apps/data-streams/src/app.module.ts`
  2. Ensure that the database is running on port 3306
     - If the your database is running on another port, or you wish to do so, remember to change the setting `port: <database port>` under the AppModule class
  3. The username used for the database is configured to be **_root_** and the password **_admin_**. You can again changes these two settinges under AppModule or configure the database to use the same username and password
  4. Test your connection and start the database.

2. When you have created the database, the next step is to open up two new windows in your faviorit terminal. First navigate to the root folder of the project, in both windows, then in one of the windowns run the command `yarn`.

3. When yarn is done running, start the **_data-streams service_** in one of the two windows by running `yarn start`, and the worker class in the other window by running the command `yarn start worker`

4. To issue the worker class to start open a theird terminal window and run `curl -X POST http://localhost:3000/start`

5. To retrive the data that has been persisted by the data-streams service run the following: `curl -X GET http://localhost:3000`.

6. To finally stop the worker class from fetching data run the following `curl -X POST http://localhost:3000/stop`

# Short-comings and future work
## Future work
- The first thing that could be changed for the idealised version that should be pushed to production, would be to change the Transporter that is being used for internal communication between Data-Streams and Worker. Here I would use a message queue (kafka or rabbitMQ) or RPC (gRPC) since both are easily scalable and reduces complexity, with respect to error handeling. The performance of RPC would still be high and keep a low latency, but an MQ would introduce some more latancy and the performance will depend on the implementation and complexity.

- For some futrue work one could add an .env file, i would also be easy to store credentials (e.g. password to the database) and keys in this .env file which would get the values from a local variable, so it wouldn't be visibel to anyone. It would also make it easier to change configuration options, by storing them in the .env file.

- Better handeling of timeouts and retries. Right now the HttpModule that is configured in the imports of the worker.module.ts module, is set to timeout an request after 5000ms. Here there can be done some Improvements by using the nestjs-axios-retrue and axios-retrue packages, instead of throwing an error if a request timesout. 

- For the configuration of the TypeOrmModule in the app.module.ts moudle, the synchronize option shouldn't be set to true in production to prevent data-loss, performance issues, and lack of control. Instead it would wise to implement migrations instead, which gives more controll when making changes to the database.

## short comings
- I think I could have choosen another API which would contain some more dynamic data, which would allow for a more interesting, transformation of the data being fetch. But I choose the nobelprize API, which returns static data, to avoid API-keys that should be stored or OAuths, where i needed to handle the storage of credentials.



