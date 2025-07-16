import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: '#282c34', padding: '20px', color: 'white' }}>
        <h1>🌟 Welcome to My React App</h1>
        <p>Your modern web app is live!</p>
      </header>

      <main style={{ padding: '40px', textAlign: 'center' }}>
        <h2>🚀 Deployed with Jenkins CI/CD</h2>
        <p>This is a sample React frontend deployed on AWS EC2 using Jenkins pipelines.</p>
        <p>Edit <code>src/App.js</code> and redeploy to see changes instantly.</p>

        <a
          href="https://your-backend-api.example.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#61dafb',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          🌐 Visit Backend API
        </a>
      </main>

      <footer style={{ backgroundColor: '#f1f1f1', padding: '10px', marginTop: '40px' }}>
        <p>© 2025 My React App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

