
## Installation

### Overview
#### Services needed:
The whole app can be hosted for free using the following services:
- Google Cloud Storage: Image Storage
- MongoDB: Database
- SendGrid: Mailing for Validating Users or Password Resets
- Heroku (optional, for deployment): Free hosting for the Express server
- Firebase (optional, for deployment): Free hosting for the React app single-page application
#### Prerequisites:
The following are needed to start the app:
- [Git](https://git-scm.com/downloads)
- [NodeJS](https://nodejs.org/en/)
    
### Instructions
    

1. Clone the repository with `git clone [https://github.com/miguelaenlle/reddit-clone](https://github.com/miguelaenlle/reddit-clone)`
2. Go into the reddit-clone directory with `cd reddit-clone`
3. Install all dependencies with `npm i` 
4. Create environment variable files. Leave them empty for now:
    1. `frontend/react-clone/.env` — Development environment variable file for frontend
    2. `frontend/react-clone/.env.production` — Production environment variable file for frontend
    3. `backend/nodemon.json` — Development environment file for the backend
    4. `backend/.env` — Production environment file for the backend
    
5. Create projects in the following services 
	1. [Google Cloud Storage](https://cloud.google.com/)
    	1. [Create a new project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
        2. [Create a new bucket](https://cloud.google.com/storage/docs/creating-buckets)
        3. [Give anyone on the Internet read permissions](https://cloud.google.com/storage/docs/access-control/making-data-public)
    2. [MongoDB](https://www.mongodb.com/)
    	1. [Create a MongoDB project](https://www.mongodb.com/docs/atlas/getting-started/)
        2. Create the following databases in Collections:
        	1. `comments`
            2. `posts`
            3. `subreddits`
            4. `users`
            5. `votes`
        3. In Database Access, create a new database user
        	1. Give it access to `readWriteAnyDatabase`
        4. (optional, for deployment) In Network Access, give access to `0.0.0.0/0` (all IPs) or your server IP
    3. [SendGrid](https://sendgrid.com/)
            1. Sign up for an account
            2. Get your developer key
6. Add the following credentials to the following files:
	1. `frontend/react-clone/.env` 
    	- Add the following:
            - `REACT_APP_BACKEND_URL` — Your local backend URL for development. Usually `localhost:5000/api`
        	- `REACT_APP_STORAGE_URL` — Your Google Cloud Storage bucket. Replace `my-bucket` with the name of your bucket.
		```
    	REACT_APP_BACKEND_URL=http://localhost:5000/api
    	REACT_APP_STORAGE_URL=https://storage.googleapis.com/my-bucket        
		```
	2. `frontend/react-clone/.env.production` (optional, for development)
		- Add the following:	
		- `REACT_APP_BACKEND_URL` — Your production backend URL for development. Replace `[my-app.herokuapp.com](http://my-app.herokuapp.com)` with your corresponding backend URL.
        - `REACT_APP_STORAGE_URL` — Your Google Cloud Storage bucket. Replace `my-bucket` with the name of your bucket.
		```
		REACT_APP_BACKEND_URL=https://my-app.herokuapp.com/api
		REACT_APP_STORAGE_URL=https://storage.googleapis.com/my-bucket
		```
            
	3. `backend/.env`
		- Add the following:
            
        ```
        {
        	"env": {
        		"DB_USER": "...",
                "DB_PASSWORD": "...",
                "DB_NAME": "...",
                "JWT_KEY": "...",
                "SENDGRID_API_KEY": "...",
                "SENDGRID_EMAIL": "...",
                "FRONTEND_URL": "...",
                "GCS_BUCKET": "...",
                "GCLOUD_PROJECT": "...",
                "GCS_KEYFILE": "..."
        	}
        }
        ```

        - `DB_USER` — MongoDB username for the user you created
        - `DB_PASSWORD` — MongoDB password for the user you created
        - `DB_NAME` — the name of your MongoDB database
        - `JWT_KEY` — your chosen JWT key. Any string.
        - `SENDGRID_API_KEY` — your SendGrid API key.
        - `SENDGRID_EMAIL` — your registered SendGrid email
        - `FRONTEND_URL` — the URL of your frontend. Used to generate confirmation and password reset emails.
        - `GCS_BUCKET` — Google Cloud storage bucket name
        - `GCLOUD_PROJECT` — Google Cloud project name
        - `GCS_KEYFILE` — Path to the JSON keyfile of your Google Cloud Storage project

	4. `backend/.env` (optional, for development)
		- Add the following:
            
		```
		DB_USER= // MongoDB username for the user you created
		DB_PASSWORD= // MongoDB password for the user you created
		DB_NAME= // the name of your MongoDB database
		JWT_KEY= // your chosen JWT key. Any string.
		SENDGRID_API_KEY=// your SendGrid API key.
		SENDGRID_EMAIL= // your registered SendGrid email
		FRONTEND_URL= // the URL of your frontend. Used to generate confirmation and password reset emails.
		GCS_BUCKET= // Google Cloud storage bucket name
		GCLOUD_PROJECT= // Google Cloud project name
		GCS_KEYFILE= // Path to the JSON keyfile of your Google Cloud Storage project
		```
            
        - `DB_USER` — MongoDB username for the user you created
        - `DB_PASSWORD` — MongoDB password for the user you created
        - `DB_NAME` — the name of your MongoDB database
        - `JWT_KEY` — your chosen JWT key. Any string.
        - `SENDGRID_API_KEY` — your SendGrid API key.
        - `SENDGRID_EMAIL` — your registered SendGrid email
        - `FRONTEND_URL` — the URL of your frontend. Used to generate confirmation and password reset emails.
        - `GCS_BUCKET` — Google Cloud storage bucket name
        - `GCLOUD_PROJECT` — Google Cloud project name
        - `GCS_KEYFILE` — Path to the JSON keyfile of your Google Cloud Storage project
            
7. Run the project:
	1. Run the `backend/` with `npm run dev`
	2. Run the `frontend/react-clone` with `npm start`
8. (optional) Deploy the project 
	1. Upload the backend Express server to [Heroku](https://dashboard.heroku.com/login) 
		1. Create a new Heroku project
		2. Upload the backend Express server to Heroku
			1. [Youtube Tutorial](https://www.youtube.com/watch?v=27GoRa4d15c)
			2. [Official Documentation](https://devcenter.heroku.com/articles/deploying-nodejs)
	2. Upload the frontend React app to [Firebase](https://firebase.google.com/) 
		1. [Create a new Firebase project](https://cloud.google.com/firestore/docs/client/get-firebase)
			1. Run `npm run build` to build the project
		2. [Upload the frontend to Firebase](https://firebase.google.com/docs/hosting/quickstart)
