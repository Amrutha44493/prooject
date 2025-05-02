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
} from "@mui/material";

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

  const [editingComment, setEditingComment] = useState({});
  const [editCommentText, setEditCommentText] = useState({});

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
        { text, author: studentId }, // ✅ renamed studentId to author
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
        { studentId }, // ✅ send studentId
        { headers: { "x-auth-token": token } }
      );
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
        { studentId }, // ✅ send studentId
        { headers: { "x-auth-token": token } }
      );
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Discussion Forum
      </Typography>

      <Button
        variant={showQueryForm ? "outlined" : "contained"}
        onClick={() => setShowQueryForm((prev) => !prev)}
        sx={{ mb: 2 }}
      >
        {showQueryForm ? "Cancel" : "Post a Query"}
      </Button>

      {showQueryForm && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6">Post a new query</Typography>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            value={newQuery.title}
            onChange={(e) =>
              setNewQuery({ ...newQuery, title: e.target.value })
            }
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            margin="normal"
            value={newQuery.description}
            onChange={(e) =>
              setNewQuery({ ...newQuery, description: e.target.value })
            }
          />
          <Button variant="contained" onClick={handlePostQuery}>
            Submit
          </Button>
        </Paper>
      )}

      {queries.map((query) => (
        <Paper key={query._id} sx={{ mb: 2, p: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar>{query.author?.name?.[0] || "?"}</Avatar>
            <Box flexGrow={1}>
              {editingQueryId === query._id ? (
                <>
                  <TextField
                    fullWidth
                    label="Edit Title"
                    value={editValues.title}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Edit Description"
                    value={editValues.description}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    sx={{ mb: 1 }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleSaveEdit(query._id)}
                    sx={{ mr: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setEditingQueryId(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h6">{query.title}</Typography>
                  <Typography>{query.description}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {`Posted by: ${
                      query.author?.name || "Unknown"
                    } on ${new Date(query.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}`}
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          <Box sx={{ mt: 1 }} display="flex" gap={1} flexWrap="wrap">
            <Button
              size="small"
              variant="outlined"
              onClick={() => toggleReplies(query._id)}
            >
              {openReplies[query._id] ? "Hide Replies" : "Show Replies"}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => handleLike(query._id)}
            >
              👍 Like ({query.likes?.length || 0})
            </Button>
            {query.author?._id === studentId && (
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditingQueryId(query._id);
                  setEditValues({
                    title: query.title,
                    description: query.description,
                  });
                }}
              >
                ✏️ Edit
              </Button>
            )}
          </Box>

          <Collapse in={openReplies[query._id]} timeout="auto" unmountOnExit>
            <List>
              {query.comments.map((comment) => {
                const isEditing = editingComment[comment._id];

                return (
                  <ListItem
                    key={comment._id}
                    alignItems="flex-start"
                    sx={{ flexDirection: "column", alignItems: "stretch" }}
                  >
                    <Box display="flex" alignItems="center">
                      <ListItemAvatar>
                        <Avatar>{comment.author?.name?.[0] || "?"}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          isEditing ? (
                            <TextField
                              fullWidth
                              value={editCommentText[comment._id] || ""}
                              onChange={(e) =>
                                setEditCommentText((prev) => ({
                                  ...prev,
                                  [comment._id]: e.target.value,
                                }))
                              }
                              size="small"
                            />
                          ) : (
                            comment.text
                          )
                        }
                        secondary={`by ${
                          comment.author?.name || "Unknown"
                        } on ${new Date(comment.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}`}
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between" mt={1}>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() =>
                          handleLikeComment(query._id, comment._id)
                        }
                      >
                        👍 Like ({comment.likes?.length || 0})
                      </Button>

                      {/* {comment.author?._id === studentId && (
                        isEditing ? (
                          <>
                            <Button
                              size="small"
                              onClick={() =>
                                handleSaveCommentEdit(query._id, comment._id)
                              }
                            >
                              Save
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setEditingComment((prev) => ({
                                  ...prev,
                                  [comment._id]: false,
                                }));
                                setEditCommentText((prev) => ({
                                  ...prev,
                                  [comment._id]: "",
                                }));
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="small"
                            onClick={() => {
                              setEditingComment((prev) => ({
                                ...prev,
                                [comment._id]: true,
                              }));
                              setEditCommentText((prev) => ({
                                ...prev,
                                [comment._id]: comment.text,
                              }));
                            }}
                          >
                             Edit
                          </Button>
                        )
                      )} */}
                    </Box>
                  </ListItem>
                );
              })}
            </List>

            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Add a reply"
              value={commentMap[query._id] || ""}
              onChange={(e) =>
                setCommentMap((prev) => ({
                  ...prev,
                  [query._id]: e.target.value,
                }))
              }
              sx={{ mt: 1 }}
            />
            <Button
              size="small"
              variant="contained"
              onClick={() => handlePostComment(query._id)}
              sx={{ mt: 1 }}
            >
              Post Reply
            </Button>
          </Collapse>
        </Paper>
      ))}

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
