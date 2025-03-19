# Personal Web Desktop (PWD)

## Overview  
The Personal Web Desktop (PWD) is a single-page application (SPA) with integrated chat functionality using Web Sockets. It includes a memory game, a messaging app, and a cookbook app.

## Features  
### **1. PWD (Main Application)**  
- Desktop-like interface with a dock displaying sub-application icons.  
- Support for opening multiple instances of the same or different sub-applications.  
- Sub-applications are draggable and can be stacked.  
- Focused sub-application appears in front of others.  
- Option to close sub-applications.  
- Built as a SPA and optionally as a progressive web application (PWA) with offline support.  

### **2. Memory Sub-App**  
- Classic memory game where the goal is to match pairs of tiles.  
- Tiles flip back if unmatched and disappear when matched.  
- Game ends when all pairs are matched.  
- Includes 3 difficulty levels.

### **3. Messages Sub-App**  
- Real-time chat application using Web Sockets.  
- Functions like common messaging apps (WhatsApp, Signal, etc.).  
- Users can set their username and after that start chatting in our internal school system.

### **4. Cookbook Sub-App**  
- Fetches recipes using an external API.
- The users may choose between 3 recipes.
