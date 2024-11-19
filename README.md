# Spoticeipt

I found people share their Spotify top tracks on X using [Receiptify](https://receiptify.herokuapp.com/). It intrigued me to make one, so here comes Spoticeipt.

## How to run

- Run `npm install`
- Add `.env` file to the root directory as follows

```env
CLIENT_ID={your_client_id}
REDIRECT_URI={your_redirect_uri}
```

- Fill `{your_client_id}` and `{your_redirect_uri}` based on your own [Spotify app](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app)
- Run `npm start`
- Open `localhost:3000` in your browser
