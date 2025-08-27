# MongoDB Atlas Setup Guide

## Your Atlas Cluster Details
- **Cluster Name**: atlas-122fda-shard-0
- **MongoDB Version**: 8.0.12 Atlas
- **Replica Set**: atlas-122fda-shard-0
- **Nodes**: 3
- **Collections**: 12
- **Databases**: 5

## Hosts
- ac-igyyieb-shard-00-01.7bgz5ij.mongodb.net:27017
- ac-igyyieb-shard-00-00.7bgz5ij.mongodb.net:27017
- ac-igyyieb-shard-00-02.7bgz5ij.mongodb.net:27017

## Setup Steps

### 1. Update Environment Variables
Your `.env` file has been updated with the Atlas connection string. You need to:

1. **Replace `username` and `password`** in the `.env` file with your actual MongoDB Atlas credentials:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@atlas-122fda-shard-0.7bgz5ij.mongodb.net/cem_events?retryWrites=true&w=majority
   ```

### 2. MongoDB Atlas Dashboard Steps
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Navigate to your cluster: `atlas-122fda-shard-0`
4. Click **"Connect"**
5. Choose **"Connect your application"**
6. Select **Node.js** and version **4.1 or later**
7. Copy the connection string provided

### 3. Database User Setup
Make sure you have a database user created:
1. In Atlas Dashboard, go to **Database Access**
2. Click **"Add New Database User"**
3. Create a user with **Read and Write** permissions
4. Note down the username and password

### 4. Network Access Setup
Ensure your IP is whitelisted:
1. In Atlas Dashboard, go to **Network Access**
2. Click **"Add IP Address"**
3. Either add your current IP or use `0.0.0.0/0` for all IPs (less secure)

### 5. Database Name
The connection string is configured to use the database name `cem_events`. If you want to use a different database name, update it in the connection string.

## Testing the Connection

After updating your credentials, test the connection:

```bash
npm run dev
```

Look for these success messages:
- ✅ MongoDB Connected: [atlas hostname]
- 📊 Database: cem_events
- 🔗 Connection State: Connected
- 🟢 Mongoose connected to MongoDB Atlas

## Troubleshooting

### Common Issues:
1. **Authentication failed**: Check username/password
2. **Network timeout**: Check IP whitelist
3. **Database name**: Ensure the database exists or will be created automatically

### Connection String Format:
```
mongodb+srv://username:password@atlas-122fda-shard-0.7bgz5ij.mongodb.net/cem_events?retryWrites=true&w=majority
```

## Security Notes
- Never commit your `.env` file with real credentials
- Use strong passwords for database users
- Limit IP access when possible
- Consider using MongoDB Atlas API keys for production

## Updated Features
The database configuration now includes:
- Enhanced error logging
- Connection state monitoring
- Graceful shutdown handling
- Improved timeout settings for Atlas
- Connection event listeners
