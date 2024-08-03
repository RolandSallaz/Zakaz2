"use client";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import "./SystemInfo.scss";
import { ISystemInfo } from "@/app/lib/utils/types";

interface Timeout {
  ref(): void;
  unref(): void;
}

export default function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState<ISystemInfo>();
  const intervalIdRef = useRef<Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SERVER_WS || "http://localhost:3003"
    );

    function intervalDataSend() {
      socketRef.current?.emit("getSystemInfo");
    }

    socketRef.current.on("connect", () => {
      intervalIdRef.current = setInterval(
        intervalDataSend,
        1000
      ) as unknown as Timeout;
    });

    socketRef.current.on("systemInfo", (data: ISystemInfo) => {
      setSystemInfo(data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current as unknown as number);
      }
    };
  }, []);

  return (
    <div className="systemInfo">
      <h2 className="systemInfo__title">Данные о системе</h2>
      <div className="systemInfo__container">
        <section className="systemInfo__section">
          <h3 className="systemInfo__section-title">CPU</h3>
          <p className="systemInfo__section-text">
            Нагрузка {systemInfo?.cpu}%
          </p>
        </section>
        <section className="systemInfo__section">
          <h3 className="systemInfo__section-title">Озу</h3>
          <p className="systemInfo__section-text">
            Всего {systemInfo?.ram?.totalMemory} GB
          </p>
          <p className="systemInfo__section-text">
            Использовано {systemInfo?.ram?.usedMemory} GB
          </p>
          <p className="systemInfo__section-text">
            Свободно {systemInfo?.ram?.freeMemory} GB
          </p>
          <p className="systemInfo__section-text">
            Используется сервером {systemInfo?.ram?.usedMemory} MB
          </p>
        </section>
        <section className="systemInfo__section">
          <h3 className="systemInfo__section-title">Память</h3>
          {systemInfo?.disk?.space?.map((disk, index) => (
            <div key={index} className="systemInfo__disk">
              <p className="systemInfo__disk-info">Диск {index + 1}</p>
              <p className="systemInfo__disk-info">Размер {disk.sizeInGB} GB</p>
              <p className="systemInfo__disk-info">Занято {disk.usedInGB} GB</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
