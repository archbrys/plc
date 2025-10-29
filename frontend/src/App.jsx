import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import MainMenu from './components/MainMenu';
import ConnectionPanel from './components/ConnectionPanel';
import DataDisplay from './components/DataDisplay';
import CommandPanel from './components/CommandPanel';
import StatusBar from './components/StatusBar';
import useWebSocket from './hooks/useWebSocket';
import './App.css';

function App() {
  const [serverUrl, setServerUrl] = useState('ws://localhost:3001');
  const [serialConnected, setSerialConnected] = useState(false);
  const [plcData, setPlcData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState('main'); // 'main', 'settings', 'monitor'
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [selectedInput, setSelectedInput] = useState(null);

  const {
    connected,
    sendMessage,
    lastMessage,
    connect,
    disconnect
  } = useWebSocket(serverUrl);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      console.log('Received message:', lastMessage);

      switch (lastMessage.type) {
        case 'connection':
          setConnectionStatus('connected');
          setSerialConnected(lastMessage.serialStatus);
          break;

        case 'plcData':
          setPlcData(prev => [
            {
              ...lastMessage.data,
              timestamp: lastMessage.timestamp
            },
            ...prev.slice(0, 99) // Keep last 100 entries
          ]);
          break;

        case 'serialStatus':
          setSerialConnected(lastMessage.status === 'connected');
          break;

        case 'error':
          console.error('Error from server:', lastMessage.message);
          alert(`Error: ${lastMessage.message}`);
          break;

        case 'commandResponse':
          console.log('Command response:', lastMessage);
          break;

        default:
          console.log('Unknown message type:', lastMessage.type);
      }
    }
  }, [lastMessage]);

  // Update connection status
  useEffect(() => {
    setConnectionStatus(connected ? 'connected' : 'disconnected');
  }, [connected]);

  const handleSendCommand = (command) => {
    if (connected) {
      sendMessage({
        type: 'command',
        payload: command
      });
    } else {
      alert('Not connected to server');
    }
  };

  const handleCircuitSelect = (circuit) => {
    setSelectedCircuit(circuit);
    console.log('Selected circuit:', circuit);
    // Send circuit selection to backend
    handleSendCommand(`CIRCUIT:${circuit}`);
  };

  const handleInputSelect = (input) => {
    setSelectedInput(input);
    console.log('Selected input:', input);

    // Handle different input selections
    switch(input) {
      case 'simulator':
        setCurrentView('monitor');
        break;
      case 'tutorials':
        alert('Tutorials section - To be implemented');
        break;
      case 'laboratory':
        alert('Laboratory Works section - To be implemented');
        break;
      case 'assessment':
        alert('Assessment Modules section - To be implemented');
        break;
      case 'video':
        alert('Video Demonstration section - To be implemented');
        break;
      default:
        break;
    }
  };

  const renderView = () => {
    switch(currentView) {
      case 'main':
        return (
          <MainMenu
            onCircuitSelect={handleCircuitSelect}
            onInputSelect={handleInputSelect}
            selectedCircuit={selectedCircuit}
            selectedInput={selectedInput}
            connected={connected}
            serialConnected={serialConnected}
          />
        );

      case 'settings':
        return (
          <div className="settings-view">
            <ConnectionPanel
              serverUrl={serverUrl}
              onServerUrlChange={setServerUrl}
              connected={connected}
              onConnect={connect}
              onDisconnect={disconnect}
            />
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentView('main')}
              style={{ marginTop: '1rem' }}
            >
              ← Back to Main Menu
            </button>
          </div>
        );

      case 'monitor':
        return (
          <div className="monitor-view">
            <div className="monitor-header">
              <h2>PLC Monitor - {selectedCircuit || 'No Circuit Selected'}</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentView('main')}
              >
                ← Back to Main Menu
              </button>
            </div>
            <div className="monitor-content">
              <div className="monitor-left">
                <CommandPanel
                  onSendCommand={handleSendCommand}
                  disabled={!connected || !serialConnected}
                  selectedCircuit={selectedCircuit}
                />
              </div>
              <div className="monitor-right">
                <DataDisplay data={plcData} />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show welcome screen first
  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="menu-bar">
            <span className="menu-item">File</span>
            <span className="menu-item">Home</span>
            <span className="menu-item">Insert</span>
            <span className="menu-item">View</span>
          </div>
        </div>
        <div className="header-right">
          <div className="rf-id">RF_ID 1001</div>
          <StatusBar
            wsConnected={connected}
            serialConnected={serialConnected}
            connectionStatus={connectionStatus}
          />
          <button
            className="btn btn-small btn-settings"
            onClick={() => setCurrentView(currentView === 'settings' ? 'main' : 'settings')}
          >
            ⚙️ Settings
          </button>
        </div>
      </header>

      <main className="app-main">
        {renderView()}
      </main>
    </div>
  );
}

export default App;

