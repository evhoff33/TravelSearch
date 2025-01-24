# Travel Planning Transparency Technical 1 Pager


Travel Planning Transparency aims to enhance the travel planning experience by aggregating travel options, comparing prices, and connecting travelers. This document outlines the technical implementation plan for the project.



## Development Phases & Milestones

****Initial Setup & Database Implementation****

**Development Environment:** We will set up our development tools and frameworks, including Django and Git development branches.
**Database:** We will use Django’s SQLite to design and implement a relational database schema to handle user data, trip details, and booking information.

****UI & Application Development****

**UI Design:** We will build an intuitive user interface using Django HTML/CSS templates for styling and JavaScript frameworks for dynamic interactions.

**Core Features:**

**Trip Planning Module:** We will develop functionality to input trip details with a variety of fields and integrate with travel APIs to fetch and display aggregated options for flights, accommodations, and car rentals.

**Price Comparison Engine:** We will aggregate and compare prices from non-biased sources, using third-party APIs such as Amadeus and Skyscanner.

**Search & Itinerary Management:** We will implement features to save searches, create and manage itineraries, and handle user accounts for saving trip information.

****CI/CD Pipeline Setup****

**Continuous Integration:** We will configure GitLab CI/CD to automate testing and build processes, ensuring code quality and reliability.
**Continuous Deployment:** We will set up automated deployment processes and monitoring to deploy changes to the production environment efficiently.

**Deployment to Production**

**Web Server:** We will deploy the Dockerized application to a web server, configuring for scalability and performance to ensure smooth operation.


**Testing:** We will perform unit, integration, and user acceptance testing to identify and resolve issues.
Documentation: We will prepare comprehensive technical documentation and user guides to support application usage and maintenance.

![diagram.drawio.svg](uploads/577eb4c14cc11bf7564535891e178157/diagram.drawio.svg)




## MVP Features

**Trip Planning:** Users will be able to enter trip details and receive aggregated options for flights, accommodations, and car rentals.
**Search & Itinerary Management:** Users will have the ability to save searches and create itineraries using their accounts.




## Technical Stack & Tools

**Backend:** We will use Django for backend development and SQLite for database management.

**Frontend:** We will utilize React to communicate with the Django backend via HTTP and render HTML with CSS for a dynamic user interface and Bootstrap/Material UI for design components.

**APIs:** We will integrate with travel APIs like Amadeus, Skyscanner and others for fetching travel data.

**CI/CD:** We will employ GitLab CI/CD for automated testing and deployment.

**Deployment:** We will use AWS EC2 for server hosting and Docker for containerization.




## Appendix

**Travel APIs:**
[Postman Travel APIs](https://www.postman.com/category/travel-apis)

**Amadeus Developer Portal:**
[Amadeus APIs](https://developers.amadeus.com)

**React Framework:**
[React Documentation](https://react.dev/learn)

**Django Documentation:**
[Django Framework Documentation](https://www.django-rest-framework.org/)

**CI/CD Platform:**
[GitLab CI/CD](gitlab.com)