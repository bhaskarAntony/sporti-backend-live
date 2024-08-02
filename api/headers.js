export default function handler(req, res) {
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data:; " +
      "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; " +
      "connect-src 'self' http://localhost:5000 https://www.sporti.ksp.gov.in https://sporti-admin.vercel.app https://sporti-services-backend.onrender.com https://sporti2.vercel.app; " +
      "frame-ancestors 'none';"
    );
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  
    res.status(200).json({ message: 'Headers set successfully' });
  }