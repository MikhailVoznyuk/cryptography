'use client'

import React from "react";
import Image from "next/image";
import styles from "./page.module.css";

import crypt from "@/lib/crypt";

export default function Home() {
  
  const [encryptContent, setEncryptContent] = React.useState('');
  const [baseContent, setBaseContent] = React.useState('');
  const [toCrypt, setToCrypt] = React.useState(true);
  const [cryptFuncType, setCryptFuncType] = React.useState(0);
  const formRef = React.useRef();
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <div className={styles.container}>
          <div className={styles.col}>
            <form className={styles.mainForm} action={crypt}>
              <select name="type" onChange={e => {
                setToCrypt(Boolean(+e.target.value));
                
                formRef.current.value = '';
              }}>
                <option value={1}>Шифрование</option>
                <option value={0}>Дешифрование</option>
              </select>
              <select name='cryptFunc' onChange={e => {
                const cryptFuncType = e.target.value;
                setCryptFuncType(+cryptFuncType);
              }}>
                <option value='0'>Перестановка</option>
                <option value='1'>Шифр Фейнстеля</option>
              </select>
              <textarea ref={formRef} onChange={(e) => {
                  crypt(e.target.value, cryptFuncType, toCrypt, setEncryptContent)}
                } name="content" placeholder="Введите сообщение"></textarea>
   
            </form>
          </div>
          <div className={styles.col}>
            { encryptContent ? (<div className={styles.resultContainer}>
                <p>{encryptContent}</p>
              </div>) : null
            }
          </div>
          
        </div>

      
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
