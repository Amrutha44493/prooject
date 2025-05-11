import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Collapse,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Fade,
  Divider,
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ForumIcon from "@mui/icons-material/Forum";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";

const DiscussionForum = () => {
  const studentId = localStorage.getItem("studentId");
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState({ title: "", description: "" });
  const [commentMap, setCommentMap] = useState({});
  const [openReplies, setOpenReplies] = useState({});
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editingQueryId, setEditingQueryId] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", description: "" });
  const [likedQueries, setLikedQueries] = useState({});
  const [likedComments, setLikedComments] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/forum", {
        headers: {
          "x-auth-token": token,
        },
      });
      setQueries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching queries", err);
      setQueries([]);
    }
  };

  const handlePostQuery = async () => {
    if (!studentId) {
      showSnackbar("Student ID is missing", "error");
      return;
    }

    try {
      const payload = { ...newQuery, author: studentId };
      await axios.post("http://localhost:5000/api/forum", payload, {
        headers: { "x-auth-token": token },
      });

      setNewQuery({ title: "", description: "" });
      setShowQueryForm(false);
      fetchQueries();
      showSnackbar("Query posted successfully", "success");
    } catch (err) {
      console.error("Failed to post query", err);
      showSnackbar("Failed to post query", "error");
    }
  };

  const handlePostComment = async (queryId) => {
    const text = commentMap[queryId];
    if (!text || !studentId) {
      showSnackbar("Comment or Student ID missing", "error");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/forum/${queryId}/comment`,
        { text, author: studentId },
        { headers: { "x-auth-token": token } }
      );

      setCommentMap((prev) => ({ ...prev, [queryId]: "" }));
      fetchQueries();
      showSnackbar("Comment added", "success");
    } catch (err) {
      console.error("Failed to post comment", err);
      showSnackbar("Failed to post comment", "error");
    }
  };

  const handleLike = async (queryId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/forum/${queryId}/like`,
        { studentId },
        { headers: { "x-auth-token": token } }
      );
      setLikedQueries(prev => ({
        ...prev,
        [queryId]: !prev[queryId]
      }));
      fetchQueries();
    } catch (err) {
      console.error("Failed to like query", err);
      showSnackbar("Failed to like query", "error");
    }
  };

  const handleLikeComment = async (queryId, commentId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/forum/${queryId}/comment/${commentId}/like`,
        { studentId },
        { headers: { "x-auth-token": token } }
      );
      setLikedComments(prev => ({
        ...prev,
        [commentId]: !prev[commentId]
      }));
      fetchQueries();
    } catch (err) {
      console.error("Failed to like comment", err);
      showSnackbar("Failed to like comment", "error");
    }
  };

  const handleSaveEdit = async (queryId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/forum/${queryId}`,
        { ...editValues },
        { headers: { "x-auth-token": token } }
      );
      fetchQueries();
      setEditingQueryId(null);
      showSnackbar("Query updated", "success");
    } catch (err) {
      console.error("Failed to update query", err);
      showSnackbar("Failed to update query", "error");
    }
  };

  const toggleReplies = (id) => {
    setOpenReplies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ 
      p: 3,
      maxWidth: 1000,
      mx: 'auto',
      background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)',
      minHeight: '100vh'
    }}>
      <Fade in={true} timeout={1000}>
        <Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 4 
          }}>
            <ForumIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Discussion Forum
            </Typography>
          </Box>

          <Button
            variant={showQueryForm ? "outlined" : "contained"}
            onClick={() => setShowQueryForm((prev) => !prev)}
            startIcon={showQueryForm ? <CloseIcon /> : <AddIcon />}
            sx={{ 
              mb: 3,
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            {showQueryForm ? "Cancel" : "Post a Query"}
          </Button>

          {showQueryForm && (
            <Fade in={showQueryForm}>
              <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Post a new query</Typography>
                  <TextField
                    fullWidth
                    label="Title"
                    margin="normal"
                    value={newQuery.title}
                    onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    margin="normal"
                    value={newQuery.description}
                    onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handlePostQuery}
                    endIcon={<SendIcon />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3
                    }}
                  >
                    Submit Query
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          )}

          <Stack spacing={3}>
            {queries.map((query) => (
              <Fade in={true} key={query._id}>
                <Card sx={{ 
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Avatar 
                        sx={{ 
                          bgcolor: "primary.main",
                          width: 48,
                          height: 48,
                          fontSize: '1.2rem'
                        }}
                      >
                        {query.author?.name?.[0] || "?"}
                      </Avatar>
                      <Box flexGrow={1}>
                        {editingQueryId === query._id ? (
                          <Box>
                            <TextField
                              fullWidth
                              label="Edit Title"
                              value={editValues.title}
                              onChange={(e) => setEditValues((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))}
                              sx={{ mb: 2 }}
                            />
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              label="Edit Description"
                              value={editValues.description}
                              onChange={(e) => setEditValues((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))}
                              sx={{ mb: 2 }}
                            />
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                onClick={() => handleSaveEdit(query._id)}
                                sx={{ borderRadius: 2 }}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => setEditingQueryId(null)}
                                sx={{ borderRadius: 2 }}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          </Box>
                        ) : (
                          <>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {query.title}
                            </Typography>
                            <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                              {query.description}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Chip
                                icon={<PersonIcon />}
                                label={query.author?.name || "Unknown"}
                                size="small"
                                sx={{ borderRadius: 1 }}
                              />
                              <Chip
                                icon={<AccessTimeIcon />}
                                label={new Date(query.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                                size="small"
                                sx={{ borderRadius: 1 }}
                              />
                            </Stack>
                          </>
                        )}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        onClick={() => toggleReplies(query._id)}
                        startIcon={<ForumIcon />}
                        sx={{ 
                          borderRadius: 2,
                          color: openReplies[query._id] ? 'primary.main' : 'text.secondary'
                        }}
                      >
                        {openReplies[query._id] ? "Hide Replies" : "Show Replies"}
                      </Button>
                      <Tooltip title={likedQueries[query._id] ? "Unlike" : "Like"}>
                        <Button
                          variant="outlined"
                          onClick={() => handleLike(query._id)}
                          startIcon={likedQueries[query._id] ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                          sx={{ 
                            borderRadius: 2,
                            color: likedQueries[query._id] ? 'primary.main' : 'text.secondary'
                          }}
                        >
                          {query.likes?.length || 0}
                        </Button>
                      </Tooltip>
                      {query.author?._id === studentId && (
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setEditingQueryId(query._id);
                            setEditValues({
                              title: query.title,
                              description: query.description,
                            });
                          }}
                          startIcon={<ModeEditOutlineOutlinedIcon />}
                          sx={{ borderRadius: 2 }}
                        >
                          Edit
                        </Button>
                      )}
                    </Stack>

                    <Collapse in={openReplies[query._id]} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 3, pl: 7 }}>
                        <List>
                          {query.comments.map((comment) => (
                            <ListItem
                              key={comment._id}
                              sx={{ 
                                flexDirection: "column",
                                alignItems: "stretch",
                                mb: 2
                              }}
                            >
                              <Paper 
                                elevation={0}
                                sx={{ 
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: 'rgba(0, 0, 0, 0.02)'
                                }}
                              >
                                <Box display="flex" alignItems="flex-start" gap={2}>
                                  <Avatar
                                    sx={{ 
                                      bgcolor: "success.main",
                                      width: 32,
                                      height: 32
                                    }}
                                  >
                                    {comment.author?.name?.[0] || "?"}
                                  </Avatar>
                                  <Box flexGrow={1}>
                                    <Typography variant="body1">
                                      {comment.text}
                                    </Typography>
                                    <Stack 
                                      direction="row" 
                                      spacing={1} 
                                      alignItems="center"
                                      sx={{ mt: 1 }}
                                    >
                                      <Chip
                                        icon={<PersonIcon />}
                                        label={comment.author?.name || "Unknown"}
                                        size="small"
                                        sx={{ borderRadius: 1 }}
                                      />
                                      <Chip
                                        icon={<AccessTimeIcon />}
                                        label={new Date(comment.createdAt).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        })}
                                        size="small"
                                        sx={{ borderRadius: 1 }}
                                      />
                                      <Tooltip title={likedComments[comment._id] ? "Unlike" : "Like"}>
                                        <Button
                                          size="small"
                                          onClick={() => handleLikeComment(query._id, comment._id)}
                                          startIcon={likedComments[comment._id] ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                                          sx={{ 
                                            color: likedComments[comment._id] ? 'primary.main' : 'text.secondary',
                                            minWidth: 'auto'
                                          }}
                                        >
                                          {comment.likes?.length || 0}
                                        </Button>
                                      </Tooltip>
                                    </Stack>
                                  </Box>
                                </Box>
                              </Paper>
                            </ListItem>
                          ))}
                        </List>

                        <Box sx={{ mt: 2 }}>
                          <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder="Add a reply..."
                            value={commentMap[query._id] || ""}
                            onChange={(e) =>
                              setCommentMap((prev) => ({
                                ...prev,
                                [query._id]: e.target.value,
                              }))
                            }
                            sx={{ mb: 1 }}
                          />
                          <Button
                            variant="contained"
                            onClick={() => handlePostComment(query._id)}
                            endIcon={<SendIcon />}
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none'
                            }}
                          >
                            Post Reply
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Stack>
        </Box>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiscussionForum;
