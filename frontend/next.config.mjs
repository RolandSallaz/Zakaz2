import os from "os";

function getLocalIp(interfaceName = "Ethernet") {
  const interfaces = os.networkInterfaces();

  if (interfaces[interfaceName]) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "localhost";
}

const dev = process.env.NODE_ENV !== "production";
const localIp = getLocalIp();  // Теперь функция выберет IP из интерфейса Ethernet

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    apiUrl: dev ? `http://${localIp}:3000/api` : `${process.env.NEXT_PUBLIC_DOMAIN}/api`,
  }, images: {
    domains: [
      ...(dev ? [localIp] : []),
      ...(process.env.NEXT_PUBLIC_DOMAIN ? [new URL(process.env.NEXT_PUBLIC_DOMAIN).hostname] : []),
    ],
    formats: ['image/webp']
  },
};


export default nextConfig;
