const Navbar = () => {
  const handleAddTelegramClick = () => {
    const botUsername = "communitysetupbot"; // Aapke bot ka username yahan likhein
    const authCallbackUrl = encodeURIComponent(
      "https://telegram-auth-five.vercel.app/"
    ); // Callback URL ko yahan likhein

    // Telegram authentication URL generate karein
    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botUsername}&origin=${authCallbackUrl}&request_access=write`;

    // User ko Telegram authentication page par redirect karein
    window.location.href = telegramAuthUrl;
  };

  return (
    <nav>
      <button onClick={handleAddTelegramClick}>Add Telegram</button>
    </nav>
  );
};

export default Navbar;
