import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initialNotes, 
  initialVideos, 
  initialDiscussions, 
  initialGroups, 
  badges, 
  defaultUserProfile 
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark'; // Dark mode default for premium feel
  });

  // User State
  const [user, setUser] = useState(defaultUserProfile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // DB States
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('ns_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });
  
  const [videos, setVideos] = useState(initialVideos);
  
  const [discussions, setDiscussions] = useState(() => {
    const saved = localStorage.getItem('ns_discussions');
    return saved ? JSON.parse(saved) : initialDiscussions;
  });
  
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('ns_groups');
    return saved ? JSON.parse(saved) : initialGroups;
  });

  // User Action States
  const [downloadedIds, setDownloadedIds] = useState(() => {
    const saved = localStorage.getItem('ns_downloads');
    return saved ? JSON.parse(saved) : ['note-1', 'note-2', 'note-4']; // Default downloads for offline page demonstration
  });

  const [savedIds, setSavedIds] = useState(() => {
    const saved = localStorage.getItem('ns_saved');
    return saved ? JSON.parse(saved) : ['note-1', 'note-3'];
  });

  // Notifications Queue
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Download Complete', message: '"DSA Complete Guide" is now available offline.', type: 'download', read: false, date: '10 mins ago' },
    { id: 'notif-2', title: 'New Upload in AI & ML', message: 'Prof. Roy uploaded "Intro to Neural Networks".', type: 'upload', read: false, date: '1 hour ago' },
    { id: 'notif-3', title: 'Study Session Reminder', message: 'ML & AI Research Circle meeting starts in 30 mins.', type: 'group', read: true, date: '2 hours ago' }
  ]);

  // Toast System
  const [toasts, setToasts] = useState([]);

  // Pomodoro Widget State
  const [pomodoro, setPomodoro] = useState({
    timeRemaining: 25 * 60,
    isRunning: false,
    mode: 'work', // work | shortBreak | longBreak
    cyclesCompleted: 1
  });

  // Search Auto-suggestions
  const [recentSearches, setRecentSearches] = useState([
    "DSA Trees guide", "OS paging", "SQL joins sheet", "UPSC current affairs"
  ]);

  // Sync state for Service Worker Simulation
  const [isOffline, setIsOffline] = useState(false);
  const [syncPending, setSyncPending] = useState(false);

  // Sync theme to body element
  useEffect(() => {
    const root = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save changes to localStorage helper
  useEffect(() => {
    localStorage.setItem('ns_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('ns_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('ns_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('ns_downloads', JSON.stringify(downloadedIds));
  }, [downloadedIds]);

  useEffect(() => {
    localStorage.setItem('ns_saved', JSON.stringify(savedIds));
  }, [savedIds]);

  // Trigger Online/Offline event simulator
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      addToast("Connection restored. Syncing resources...", "success");
    };
    const handleOffline = () => {
      setIsOffline(true);
      addToast("You are offline. NoteSphere is running in Offline Mode.", "warning");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Pomodoro tick timer
  useEffect(() => {
    let interval = null;
    if (pomodoro.isRunning) {
      interval = setInterval(() => {
        setPomodoro(prev => {
          if (prev.timeRemaining <= 1) {
            clearInterval(interval);
            const newMode = prev.mode === 'work' ? 'shortBreak' : 'work';
            const cycles = prev.mode === 'work' ? prev.cyclesCompleted + 1 : prev.cyclesCompleted;
            addToast(prev.mode === 'work' ? 'Time to take a break!' : 'Break over, back to studying!', 'success');
            
            // Add notification
            addNotification({
              title: prev.mode === 'work' ? 'Focus Interval Completed!' : 'Break Finished!',
              message: prev.mode === 'work' ? 'Great job! Rest for 5 mins.' : 'Focus for another 25 mins.',
              type: 'group'
            });

            return {
              ...prev,
              isRunning: false,
              mode: newMode,
              timeRemaining: newMode === 'work' ? 25 * 60 : 5 * 60,
              cyclesCompleted: cycles
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoro.isRunning, pomodoro.mode]);

  // Toast Helpers
  const addToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Notification Helpers
  const addNotification = ({ title, message, type }) => {
    const id = `notif-${Date.now()}`;
    const newNotif = { id, title, message, type, read: false, date: 'Just now' };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Actions
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addNote = (newNote) => {
    const updatedNote = {
      id: `note-${Date.now()}`,
      downloadCount: 0,
      likeCount: 0,
      rating: 5.0,
      uploadDate: new Date().toISOString().split('T')[0],
      uploader: {
        name: user.name,
        avatar: user.avatar,
        reputation: 5.0
      },
      ...newNote
    };
    setNotes(prev => [updatedNote, ...prev]);
    setUser(prev => ({ ...prev, uploadsCount: prev.uploadsCount + 1 }));
    addToast(`Successfully uploaded "${newNote.title}"!`, 'success');
    addNotification({
      title: 'Material Uploaded',
      message: `Your resource "${newNote.title}" was published.`,
      type: 'upload'
    });
  };

  const toggleLikeNote = (noteId) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        const liked = note.isLiked;
        return {
          ...note,
          likeCount: liked ? note.likeCount - 1 : note.likeCount + 1,
          isLiked: !liked
        };
      }
      return note;
    }));
  };

  const toggleBookmarkNote = (noteId) => {
    let active = false;
    setSavedIds(prev => {
      if (prev.includes(noteId)) {
        return prev.filter(id => id !== noteId);
      } else {
        active = true;
        return [...prev, noteId];
      }
    });

    setUser(prev => ({
      ...prev,
      savedCount: active ? prev.savedCount + 1 : Math.max(0, prev.savedCount - 1)
    }));

    addToast(active ? "Saved to your bookmarks" : "Removed from bookmarks", "info");
  };

  const downloadNote = (noteId) => {
    const target = notes.find(n => n.id === noteId);
    if (!target) return;

    if (!downloadedIds.includes(noteId)) {
      setDownloadedIds(prev => [...prev, noteId]);
      setUser(prev => ({ ...prev, downloadsCount: prev.downloadsCount + 1 }));
      setNotes(prev => prev.map(n => n.id === noteId ? { ...n, downloadCount: n.downloadCount + 1 } : n));
      addToast(`Downloaded "${target.title}" to offline library`, "success");
      addNotification({
        title: 'Offline Download Ready',
        message: `"${target.title}" was saved for offline reading.`,
        type: 'download'
      });
    } else {
      addToast(`"${target.title}" is already in your offline library`, "info");
    }
  };

  const removeDownloadedNote = (noteId) => {
    setDownloadedIds(prev => prev.filter(id => id !== noteId));
    setUser(prev => ({ ...prev, downloadsCount: Math.max(0, prev.downloadsCount - 1) }));
    addToast("Removed from offline downloads", "info");
  };

  // Discussions actions
  const addDiscussion = (title, description, tags) => {
    const newDiscussion = {
      id: `disc-${Date.now()}`,
      title,
      description,
      tags,
      upvotes: 0,
      uploader: {
        name: user.name,
        avatar: user.avatar
      },
      replies: [],
      date: new Date().toISOString().split('T')[0]
    };
    setDiscussions(prev => [newDiscussion, ...prev]);
    addToast("Discussion topic posted successfully", "success");
  };

  const upvoteDiscussion = (discId) => {
    setDiscussions(prev => prev.map(d => {
      if (d.id === discId) {
        return { ...d, upvotes: d.upvotes + 1 };
      }
      return d;
    }));
    addToast("Upvoted question", "success");
  };

  const addReplyToDiscussion = (discId, replyContent) => {
    const newReply = {
      id: `rep-${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      content: replyContent,
      date: new Date().toISOString().split('T')[0],
      upvotes: 0
    };

    setDiscussions(prev => prev.map(d => {
      if (d.id === discId) {
        return {
          ...d,
          replies: [...d.replies, newReply]
        };
      }
      return d;
    }));
    addToast("Reply added to thread", "success");
  };

  // Study group actions
  const toggleJoinGroup = (groupId) => {
    let joined = false;
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        joined = !g.isJoined;
        return {
          ...g,
          members: joined ? g.members + 1 : g.members - 1,
          isJoined: joined
        };
      }
      return g;
    }));

    addToast(joined ? "Joined study community group" : "Left study group", joined ? "success" : "info");
    if (joined) {
      addNotification({
        title: 'Group Joined',
        message: `You are now a member of the study circle.`,
        type: 'group'
      });
    }
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      user,
      setUser,
      isLoggedIn,
      setIsLoggedIn,
      notes,
      setNotes,
      videos,
      discussions,
      groups,
      downloadedIds,
      savedIds,
      notifications,
      markAllNotificationsRead,
      clearNotifications,
      toasts,
      addToast,
      pomodoro,
      setPomodoro,
      recentSearches,
      setRecentSearches,
      isOffline,
      setIsOffline,
      syncPending,
      setSyncPending,
      addNote,
      toggleLikeNote,
      toggleBookmarkNote,
      downloadNote,
      removeDownloadedNote,
      addDiscussion,
      upvoteDiscussion,
      addReplyToDiscussion,
      toggleJoinGroup,
      badges
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
