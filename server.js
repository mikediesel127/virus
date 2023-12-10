const express = require('express');
const multer = require('multer');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');


// Models
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Message = require('./models/message');
const Community = require('./models/community'); // Adjust the path to where your model is located

const app = express();
// App
const port = process.env.PORT || 3000;

//sockets
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/virusSocialDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(session({
  secret: 'onetwoseven',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));


// Set the view engine to ejs and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In your Express.js route handler
app.get('/profile', (req, res) => {
  // Retrieve user ID from session
  const userId = req.session.userId;

  // Fetch user data based on userId
  const userData = fetchUserData(userId);

  // Render the HTML template and pass session data as a template variable
  res.render('profile', { userId, userData });
});




app.get('/', async (req, res) => {
  try {
// const userId = req.query.userId;
     const userId = req.session.userId;
console.log('User ID:', userId); // Add this line for debugging
const user = await User.findById(userId);
console.log(user);

    // if (!user) {
    //   // Handle the case when the user is not found
    //   return res.status(404).send('User not found');
    // }

    res.render('index', { user: user });
  } catch (error) {
    // Handle errors appropriately
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// -------FILE UPLOADS---
// Multer configuration
const storage = multer.diskStorage({
  destination: 'uploads/',  // Specify the directory where uploaded files will be stored
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// PUT route to update user data and profile picture
app.put('/api/user/:id', upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, profilePicture } = req.body;

    // Check if a new profile picture is uploaded
    const newProfilePicture = req.file ? req.file.filename : profilePicture;

    // Update user data in the database, including the new file path
    const updatedUser = await User.findByIdAndUpdate(userId, {
      username: username,
      password: password,
      profilePicture: newProfilePicture,
    }, { new: true }); // { new: true } returns the updated document

    // Send success response with updated user data
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});



// ----------WIDGETS-----------------
// ----------------------------------

const Widget = require('./models/widget'); // Adjust the path as necessary

// CREATE WIDGET
app.post('/api/widgets', async (req, res) => {
  try {
    const { name, elements, position, settings } = req.body;

    // Validation (example)
    if (!name || !elements) {
      return res.status(400).send('Missing required fields');
    }

    const newWidget = new Widget({ name, elements, position, settings });
    await newWidget.save();
    res.status(201).json(newWidget);
  } catch (error) {
    console.error('Error saving widget:', error);
    res.status(500).send('Internal Server Error');
  }
});

// FETCH WIDGETS
app.get('/api/widgets', async (req, res) => {
  try {
    const widgets = await Widget.find({}); // Replace 'Widget' with your model
    res.json(widgets);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE WIDGET
app.delete('/api/widgets/:widgetId', async (req, res) => {
    try {
        await Widget.findByIdAndDelete(req.params.widgetId);
        res.send({ message: 'Widget deleted successfully' });
    } catch (error) {
        console.error('Error deleting widget:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/api/user/:userId/saved-widgets', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('savedWidgets', 'Widget');
        if (!user) {
            return res.status(404).send('User not found');
        }

        const widgets = user.savedWidgets;
        if (!widgets || widgets.length === 0) {
            return res.status(404).send('No widgets found');
        }

        res.json(widgets);
    } catch (error) {
        console.error('Error fetching saved widgets:', error);
        res.status(500).send('Internal Server Error');
    }
});




module.exports = app;


// -------------END OF WIDGETS------------
//----------------------------------------
//----------------
// server.js or app.js
// Example route for the community page
app.get('/community', async (req, res) => {
  try {
    const communityId = req.query.communityId; // Retrieve the community ID from the query parameter

    // Retrieve community data from the database based on communityId
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).send('Community not found');
    }

    // Render the community page with the retrieved data
    res.render('community_page', { title: 'Community Page', community: community });
  } catch (error) {
    console.error('Error fetching community data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/community/create', async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).send('Community already exists.');
    }
    const community = new Community({ name, description });
    await community.save();
    res.status(201).send(community);
  } catch (error) {
    if (error.code === 11000) {
      // This is a duplicate key error
      res.status(400).send('A community with this name already exists.');
    } else {
      console.error('Server error:', error);
      res.status(500).send('Internal Server Error');
    }
  }
});


app.get('/api/communities', async (req, res) => {
  try {
    const communities = await Community.find().populate('members.user', 'username');
    console.log(communities); // Add this line to check the structure of the data
    res.json(communities);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// JOIN COMMUNITY
// Example route for joining a community
app.post('/api/community/join/:communityId', async (req, res) => {
  const communityId = req.params.communityId;
  const userId = req.query.userId; // Retrieve userId from query parameter

  console.log('Attempting to join community:', communityId);
  console.log('User ID from query parameter:', userId);

  try {
    // Find the community and user in the database
    const community = await Community.findById(communityId);
    const user = await User.findById(userId);

    if (!community || !user) {
      console.log('Community or user not found.');
      return res.status(404).send('Community or user not found.');
    }

    // Add the userId to the community's members array
    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }

    // Add the communityId to the user's communities array
    if (!user.communities.includes(communityId)) {
      user.communities.push(communityId);
      await user.save();
    }

    console.log('Joined community successfully.');
    res.status(200).json({ message: 'Successfully joined community' });
  } catch (error) {
    console.error('Error joining community:', error);
    res.status(500).json({ error: error.message });
  }
});





// server.js
app.get('/api/user/:userId/communities', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Fetching communities for user ID: ${userId}`);
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID.');
    }
    
    const communities = await Community.find({ 'members.user': userId }).populate('members.user', 'username');
    console.log(`Found communities:`, communities);
    
    res.json(communities);
  } catch (error) {
    console.error('Error fetching user communities:', error);
    res.status(500).send(error.message);
  }
});


// API endpoint to fetch user communities (USE THIS ONE)
// Example debugging in your route
app.get('/api/user/communities/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user document
    const user = await User.findById(userId);

    // Log user and community IDs for debugging
    console.log('User:', user);
    console.log('Community IDs:', user.communities);

    // Find communities where the user is a member
    const userCommunities = await Community.find({ '_id': { $in: user.communities } }, 'name');

    console.log('User communities:', userCommunities);

    res.json(userCommunities);
  } catch (error) {
    console.error('Error fetching user communities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// module.exports = app;

// Endpoint to get communities for a user
app.get('/api/user/communities', async (req, res) => {
  const userId = req.session.user._id; // Assuming the user ID is stored in the session

  try {
    const communities = await Community.find({ 'members.user': userId });
    res.json(communities);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// ---------GO TO COMMUNITY PAGE--------------
// Example route for the community page
app.get('/community/', async (req, res) => {
  try {
    const communityId = req.params.communityId;
    // Retrieve community data from the database
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).send('Community not found');
    }

    // Render the community page with the retrieved data
    res.render('community_page', { title: 'Community Page', community: community });
  } catch (error) {
    console.error('Error fetching community data:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Server-side route to get user data for editing
app.get('/api/user/:id/', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      // Handle the case when the user is not found
      return res.status(404).json({ error: 'User not found' });
    }

    // Only include necessary data for editing (e.g., exclude password)
    const userDataForEdit = {
      username: user.username,
      profilePicture: user.profilePicture,
      id: user._id
      // Add other fields needed for editing
    };

    res.status(200).json(userDataForEdit);
  } catch (error) {
    // Handle errors appropriately
    console.error('Error fetching user data for editing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//OTHER USER PROFILE
// app.js (or wherever your user profile route is)
// app.get('/user/:id', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     const communities = await Community.find({ 'members.user': userId });
//     const points = user.points; // Assuming points are a property of the user object

//     res.render('other-user-profile', { 
//       title: 'User Profile', 
//       user: user, 
//       communities: communities,
//       points: points
//       // userIsLoggedInUser: /* Add logic to check if the viewer is the owner of the profile */,
//     });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });


// Example server-side route to update user points
app.post('/api/user/:id/points', async (req, res) => {
  try {
    const userId = req.params.id;
    const { points } = req.body;

    // Update the user's points in the database
    await User.findByIdAndUpdate(userId, { points: points });

    res.status(200).send('Points updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get('/user', async (req, res) => {
    try {
        const userId = req.query.userId;
        const user = await User.findById(userId).populate('savedWidgets');
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Console log for debugging
        console.log("Fetched widgets for user:", user.savedWidgets.map(w => w.name));

        res.render('other-user-profile', { title: 'User Profile', user: user, widgets: user.savedWidgets });
    } catch (error) {
        console.error('Error fetching user data and widgets:', error);
        res.status(500).render('error', { error: error });
    }
});




app.use(function(req, res, next) {
  res.locals.darkMode = req.session.darkMode || false;
  next();
});

app.get('/api/user/:userId/posts', async (req, res) => {
    try {
        const userId = req.params.userId;

        const userPosts = await Post.find({ 
            createdBy: userId 
        }).sort({ createdAt: -1 }); // Sort by most recent first

        res.json(userPosts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).send('Server error');
    }
});

//CHAT // MESSAGE
// Example server-side route to get user data
app.get('/api/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('username');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Endpoint to get posts by a specific user
app.get('/api/posts/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ createdBy: userId }); // Replace 'createdBy' with the actual field name in your Post model
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Internal Server Error');
  }
});

// -----------POST LIKES----------
app.post('/api/posts/:postId/like', async (req, res) => {
  const postId = req.params.postId;
  // const userId = req.user._id; // Assuming you have the user's ID from session/authentication

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      // User already liked the post, so unlike it
      post.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked the post, so add like
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length }); // Send back the total number of likes
  } catch (error) {
    res.status(500).send(error.message);
  }
});




app.get('/communities', async (req, res) => {
  try {
    const communities = await Community.find(); // Fetch communities from the database
    res.render('community', { communities }); // Pass the communities array to the EJS template
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/user', async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).send('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword
    });
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/search', async (req, res) => {
    const searchTerm = req.query.query;

    if (!searchTerm) {
        return res.status(400).send('Search term is required');
    }

    try {
        const userResults = await User.find({ username: new RegExp(searchTerm, 'i') });

        const widgetResults = await Widget.find(
            { $text: { $search: searchTerm } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } }).limit(10);

        // Include community search
        const communityResults = await Community.find(
            { name: new RegExp(searchTerm, 'i') }
        );

        res.json({
            users: userResults.map(u => ({ id: u._id, name: u.username, profilePicture: u.profilePicture })),
            widgets: widgetResults.map(w => ({ id: w._id, name: w.name })),
            communities: communityResults.map(c => ({ id: c._id, name: c.name }))
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/suggestions', async (req, res) => {
  try {
    const searchRegex = new RegExp(req.query.content, 'i');
    const postResults = await Post.find({ content: { $regex: searchRegex } });
    const userResults = await User.find({ username: { $regex: searchRegex } });
    res.json({ posts: postResults, users: userResults });
  } catch (error) {
    res.status(500).send('Error fetching suggestions');
  }
});

app.get('/api/posts', async (req, res) => {
    try {
        // Fetch all posts without the 5-day limit
        const posts = await Post.find({}).populate('user').sort({ createdAt: -1 }); // Populate user and sort by date

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Server error');
    }
});


app.post('/api/posts', async (req, res) => {
  if (!req.session.userID) {
    return res.status(401).send("User not authenticated");
  }

  try {
    const newPost = new Post({
      ...req.body,
      user: req.session.userID
    });
    const savedPost = await newPost.save();
    res.status(201).send(savedPost);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/api/posts/:postID', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.postID, req.body, { new: true });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/api/posts/:postID', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.postID);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/posts/:postID/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postID });
    res.json(comments);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/posts/:postID/comments', async (req, res) => {
  try {
    const newComment = new Comment({ ...req.body, post: req.params.postID });
    const savedComment = await newComment.save();
    res.status(201).send(savedComment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/messages/:userID', async (req, res) => {
  try {
    const messages = await Message.find({ to: req.params.userID });
    res.json(messages);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).send(savedMessage);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.isLoggedIn = true;
      req.session.username = user.username;
      req.session.userID = user._id;
      res.json({
        message: 'Logged in successfully',
        username: user.username,
        userID: user._id
      });

    } else {
      res.status(401).send('Authentication failed');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/logout', function(req, res) {
  // Here you would clear the session or token that keeps the user logged in
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
      res.send("Error logging out");
    } else {
      // Redirect to the homepage or login page after logout
      res.redirect('/');
    }
  });
});

// -------------NOTIFICATIONS------------------
    // POST LIKE
app.post('/like', (req, res) => {
  // logic
  io.emit('notification', { type: 'like', postId: req.body.postId, byUserId: req.user._id });
});

  // POST COMMENT
app.post('/comment', async (req, res) => {
  // ...comment logic (save comment to the database)

  // After saving the comment, emit a notification
  const notification = {
    type: 'comment',
    postId: req.body.postId,
    byUserId: req.user._id, // Assuming you have the user in the request
    message: `${req.user.username} commented on your post`
  };

  // Emit to all users - in a real app, you would target a specific user
  io.emit('notification', notification);

  res.send({ success: true });
});

// -----FRIEND REQUEST-----
// Example server-side route to handle friend request
app.post('/api/user/:id/friend-request', async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const authenticatedUserId = req.query.authenticatedUserId;

    console.log(`Target User ID: ${targetUserId}, Authenticated User ID: ${authenticatedUserId}`);

    // Check if the user is trying to send a friend request to themselves
    if (targetUserId === authenticatedUserId) {
      return res.status(400).send('You cannot send a friend request to yourself');
    }

    // Check if the users are already friends
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).send('Target user not found');
    }

    if (targetUser.friends.includes(authenticatedUserId)) {
      return res.status(400).send('User is already your friend');
    }

    // Add the friend request to the target user's pending requests
    targetUser.pendingRequests.push(authenticatedUserId);
    await targetUser.save();

    res.status(200).send('Friend request sent successfully');
  } catch (error) {
    console.error('Error handling friend request:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ----PENDING USER REQUESTS---
// Example server-side route to get pending friend requests
app.get('/api/user/:id/pending-requests', async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and populate the pendingRequests array with user details
    const user = await User.findById(userId).populate('pendingRequests', 'username profilePicture');

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send the pending friend requests as a response
    res.status(200).json(user.pendingRequests);
  } catch (error) {
    console.error('Error fetching pending friend requests:', error);
    res.status(500).send('Internal Server Error');
  }
});






// ----------EOF------------


//AUTH AND PROTECTED ROUTES-----
function checkAuthentication(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.status(401).send('Not authorized');
  }
}

app.get('/api/protected', checkAuthentication, (req, res) => {
  res.send('This route is protected and you are authenticated');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ---------------Save preferences--------------
app.post('/api/user/:userId/preferences', async (req, res) => {
  try {
    const userId = req.params.userId;
    const preferences = req.body.preferences;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID.');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Update preferences
    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.status(200).send('Preferences updated successfully.');
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).send(error.message);
  }
});

// Get preferences
app.get('/api/user/:userId/preferences', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid user ID.');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    res.json(user.preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).send(error.message);
  }
});

app.get('/api/user/:userId/widgets', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Fetch widgets logic
        const widgets = await Widget.find({ userId: userId });
        res.json(widgets);
    } catch (error) {
        console.error('Error fetching widgets:', error);
        res.status(500).send('Internal Server Error');
    }
});

// ---------ADD WIDGET TO DASHBOARD--------
app.post('/api/user/:userId/add-widget', async (req, res) => {
    try {
        const { widgetId } = req.body;
        const userId = req.params.userId;

        console.log(`Backend received widget ID: ${widgetId} for user ID: ${userId}`);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the widget is already in the user's savedWidgets
        if (user.savedWidgets.includes(widgetId)) {
            return res.status(400).json({ message: 'Widget already saved' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { savedWidgets: widgetId } },
            { new: true }
        );

        console.log(`Updated user's saved widgets:`, updatedUser.savedWidgets);

        res.status(200).json({ message: 'Widget added successfully', savedWidgets: updatedUser.savedWidgets });
    } catch (error) {
        console.error('Error adding widget:', error);
        res.status(500).send('Internal Server Error');
    }
});
// --------REMOVE WIDGET FROM DASHBOARD------
app.post('/api/user/:userId/remove-widget', async (req, res) => {
    try {
        const { widgetId } = req.body;
        const userId = req.params.userId;

        console.log(`Backend received request to remove widget ID: ${widgetId} for user ID: ${userId}`);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { savedWidgets: widgetId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`Updated user's saved widgets after removal:`, updatedUser.savedWidgets);

        res.status(200).json({ message: 'Widget removed successfully', savedWidgets: updatedUser.savedWidgets });
    } catch (error) {
        console.error('Error removing widget:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/api/user/:userId/widgets', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Fetch user and populate savedWidgets
        const user = await User.findById(userId).populate({
            path: 'savedWidgets',
            model: 'Widget' // Assuming 'Widget' is the name of your widget model
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extracting widget details
        const widgets = user.savedWidgets.map(widget => ({
            id: widget._id,
            name: widget.name,
            // Add other widget fields you want to include
        }));

        res.json(widgets);
    } catch (error) {
        console.error('Error fetching user widgets:', error);
        res.status(500).send('Internal Server Error');
    }
});

//SAVE WIDGET TO FAVOURITES
app.post('/api/user/:userId/save-widget', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { widgetId } = req.body;

        // Add the widget to the user's savedWidgets array
        await User.findByIdAndUpdate(userId, { $push: { savedWidgets: widgetId } });

        res.status(200).json({ message: 'Widget saved successfully' });
    } catch (error) {
        console.error('Error saving widget:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/user/:id/accept-friend-request', async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const authenticatedUserId = req.query.authenticatedUserId;

    // Fetch both users
    const targetUser = await User.findById(targetUserId);
    const requestingUser = await User.findById(authenticatedUserId);

    if (!targetUser || !requestingUser) {
      return res.status(404).send('One or both users not found');
    }

    // Remove the authenticated user from the target user's pending requests
    targetUser.pendingRequests.pull(authenticatedUserId);

    // Add each other to their friends lists if not already present
    if (!targetUser.friends.includes(authenticatedUserId)) {
      targetUser.friends.push(authenticatedUserId);
    }
    if (!requestingUser.friends.includes(targetUserId)) {
      requestingUser.friends.push(targetUserId);
    }

    // Save changes to both users
    await targetUser.save();
    await requestingUser.save();

    res.status(200).send('Friend request accepted');
  } catch (error) {
    console.error('Error handling accept friend request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/user/:id/friends', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('friends', 'username profilePicture');

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ----------CHECK FRIEND REQUESTS STATUS--------
app.get('/api/friendship-status/:currentUserId/:profileUserId', async (req, res) => {
    try {
        const { currentUserId, profileUserId } = req.params;

        // Assuming the 'User' model has fields like 'friends' and 'pendingRequests'
        const currentUser = await User.findById(currentUserId);
        const profileUser = await User.findById(profileUserId);

        if (!currentUser || !profileUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser.friends.includes(profileUserId)) {
            return res.json({ status: 'friends' });
        } else if (currentUser.pendingRequests.includes(profileUserId)) {
            return res.json({ status: 'request_sent' });
        } else if (profileUser.pendingRequests.includes(currentUserId)) {
            return res.json({ status: 'request_received' });
        } else {
            return res.json({ status: 'not_friends' });
        }
    } catch (error) {
        console.error('Error in checking friendship status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/api/user/:userId/send-friend-request', async (req, res) => {
    try {
        const userId = req.params.userId; // The ID of the user to whom the request is being sent
        const loggedInUserId = req.session.userId; // Or however you store the logged-in user's ID

        // Logic to send friend request
        // For example, add loggedInUserId to the pendingRequests of userId
        await User.findByIdAndUpdate(userId, { $push: { pendingRequests: loggedInUserId } });

        res.status(200).send('Friend request sent');
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).send('Internal Server Error');
    }
});


// -------SEND MESSAGE---------
app.post('/api/messages/send', async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;
        if (!sender || !receiver || !content) {
            return res.status(400).send('Missing message details');
        }

        const newMessage = new Message({ sender, receiver, content });
        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully', messageId: newMessage._id });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Internal Server Error');
    }
});

// server.js or a similar server-side file

app.get('/api/chat/search-users', async (req, res) => {
    const searchTerm = req.query.query;
    if (!searchTerm) {
        return res.status(400).send('Search term is required');
    }

    try {
        const users = await User.find({ username: new RegExp(searchTerm, 'i') });
        res.json(users.map(user => ({
            id: user._id,
            name: user.username,
            profilePicture: user.profilePicture
        })));
    } catch (error) {
        console.error('Error searching users for chat:', error);
        res.status(500).send('Internal Server Error');
    }
});

// In your server-side code (e.g., app.js or a dedicated routes file)
app.get('/api/chat/conversation/:currentUserId/:selectedUserId', async (req, res) => {
    try {
        const currentUserId = req.params.currentUserId;
        const selectedUserId = req.params.selectedUserId;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: selectedUserId },
                { sender: selectedUserId, receiver: currentUserId }
            ]
        }).sort({ timestamp: 1 }); // Sorting by timestamp to get messages in order

        res.json(messages);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).send('Internal Server Error');
    }
});

// In your server-side code (e.g., app.js or routes file)
app.post('/api/chat/send-message', async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;

        const newMessage = new Message({ sender, receiver, content });
        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/api/chat/recent/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the user exists
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).send('User not found');
        }

        // Fetch recent chats
        const recentChats = await Message.fetchRecentChatsForUser(userId);
        res.json(recentChats);
    } catch (error) {
        console.error('Error fetching recent chats:', error);
        res.status(500).send('Internal Server Error');
    }
});



// ----------END EMSSSAGE------

// -----GIT-------
const git = require('simple-git')();
git.addRemote('origin', 'https://github.com/mikediesel127/virus')
  .then(() => console.log('Remote added successfully'))
  .catch(err => console.error('Error adding remote:', err));

  git.add('./*') // Add all files
  .commit('Initial commit')
  .then(() => console.log('Files committed'));

  git.push('origin', 'master') // Replace 'master' with your branch name if different
  .then(() => console.log('Code pushed to GitHub'))
  .catch(err => console.error('Error pushing code:', err));
