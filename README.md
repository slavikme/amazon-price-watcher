Amazon Price Watcher
====================
This project is watching over prices changes on Amazon store, logs the history and shows the best time prices over time.

To Do List
----------
* Notify about one or more products changed to the new lowest price. It should be defined by a specific rule.
* Shows one or more products price trend. Shows over a graph, one or more products' price history.
* Products managing section

Requirements
------------
* NodeJS and NPM (latest version)
* You must have a Product Advertising API account. If you don't have, create one [here](https://affiliate-program.amazon.com/gp/flex/advertising/api/sign-in.html).
* You must have AWS account security credentials, as described [here](https://affiliate-program.amazon.com/gp/advertising/api/detail/your-account.html) in the Security Credentials section.
* An alphanumeric token that uniquely identifies you as an Associate. To obtain an Associate Tag, go to [Becoming an Associate](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/becomingAssociate.html).

Install
-------
1. Create a credentials file at the root of the project `./.aws/credentials` (using the AWS credentials, as described in the requirements above):
    
    ```ini
    [default]
    aws_access_key_id = your_access_key
    aws_secret_access_key = your_secret_key
    associate_tag = your_associate_tag
    ```
    
2. Install the required libraries, by running the following command from the root of the project:

    ```bash
    npm install 
    ```

Run
---
1. From the root of the project run the command

    ```bash
    node bin/www
    ```
    
2. On your browser, navigate to http://127.0.0.1:3000