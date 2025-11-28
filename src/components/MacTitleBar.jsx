export default function MacTitleBar() {
  return (
    <div style={{
      WebkitAppRegion: 'drag',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '12px',
      gap: '8px',
      backdropFilter: 'blur(20px)',
      background: 'rgba(255,255,255,0.06)'
    }}>
      <div
        style={{
          width: '12px', height: '12px',
          borderRadius: '50%',
          background: '#ff5f57',
          WebkitAppRegion: 'no-drag'
        }}
        onClick={() => window.win.close()}
      />

      <div
        style={{
          width: '12px', height: '12px',
          borderRadius: '50%',
          background: '#ffbd2e',
          WebkitAppRegion: 'no-drag'
        }}
        onClick={() => window.win.minimize()}
      />

      <div
        style={{
          width: '12px', height: '12px',
          borderRadius: '50%',
          background: '#28c940',
          WebkitAppRegion: 'no-drag'
        }}
        onClick={() => window.win.maximize()}
      />
    </div>
  );
}
