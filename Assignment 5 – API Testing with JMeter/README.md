Assignment 5 – API Testing with JMeter
Project Overview
This project contains a JMeter test plan for automated API testing of the Simple Books API. It covers full CRUD operations using CSV-driven data and validates a complete order lifecycle.

Tools & Technologies

Apache JMeter
Simple Books API (https://simple-books-api.click)
CSV Data Set Config for data-driven testing


Files
FileDescriptiontest-plan.jmxJMeter test plan with all HTTP samplers, extractors, and listenersUsers.csvCSV file containing test data (customerName, bookId)

Test Plan Structure
Test Plan
├── CSV Data Set Config        # Loads customerName and bookId from Users.csv
├── HTTP Request Defaults      # Base URL: simple-books-api.click
└── Thread Group (3 threads)
    ├── POST - Register Client     # Registers a new API client, extracts accessToken
    ├── POST - Create Order        # Creates an order using bookId from CSV, extracts orderId
    ├── GET - Get Order            # Retrieves the created order by orderId
    ├── PATCH - Full UpdateRequest # Updates the order's customerName (full update)
    ├── PATCH - Partial Update     # Partially updates the order's customerName
    ├── DELETE - Delete Order      # Deletes the order by orderId
    ├── View Results Tree          # Listener for detailed request/response inspection
    └── Summary Report             # Listener for pass/fail summary

CRUD Operations Covered
MethodEndpointDescriptionPOST/api-clientsRegister API client and get access tokenPOST/ordersCreate a new book orderGET/orders/${orderId}Retrieve order by IDPATCH/orders/${orderId}Update order (full)PATCH/orders/${orderId}Update order (partial)DELETE/orders/${orderId}Delete order

Note: The Simple Books API does not expose a PUT endpoint for orders. PATCH is used for both full and partial updates.


CSV Data Format
The Users.csv file drives the test with different customer names per thread:
customerName,bookId
FreshUser20260522A,1
FreshUser20260522B,1
FreshUser20260522C,1

customerName — used in order creation and update requests
bookId — must be an in-stock book ID (bookId 1 is used as it is consistently available)
