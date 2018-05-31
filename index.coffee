express = require 'express'
app = do express
path = require 'path'
http = require('http').Server app
io = require('socket.io')(http)

app.use express.static path.join __dirname, '/public'

SOCKETS = []

addSocket = (socket) ->
  SOCKETS.push socket
  console.log socket

removeSocket = (socket) ->
  for s, ind in SOCKETS
    if s.id == socket.id
      return SOCKETS.splice ind, 1

getDisplay = (socket) ->
  if socket.displaySocket then return socket.displaySocket
  for s in SOCKETS
    console.log s.handshake.query, socket.handshake.query
    if s.handshake.query.id == socket.handshake.query.id && s.handshake.query.type == 'display'
      socket.displaySocket = s
      return s

proxyEventToDisplay = (socket, event) ->
  socket.on event, (data) ->
    
    disp = getDisplay socket
    unless disp then return
    console.log disp.handshake.query, event, data
    disp.emit event, data

io.on 'connection', (socket) ->
  addSocket socket
  # socket.emit 'start'
  proxyEventToDisplay socket, 'remoteConnected'
  proxyEventToDisplay socket, 'tap'
  proxyEventToDisplay socket, 'start'
  proxyEventToDisplay socket, 'end'
  proxyEventToDisplay socket, 'position'
  proxyEventToDisplay socket, 'phase'
  socket.on 'disconnect', -> removeSocket socket

  

http.listen 3000, (err) ->
    if err then throw err
    console.log "Listening on *:3000"