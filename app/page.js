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
  const [cryptKey, setCryptKey] = React.useState(null);
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
              <>
              { (cryptFuncType == 1) ? 
                <input placeholder="Введите ключ" onChange={(e) => {
                  setCryptKey(e.target.value)
                }}></input>
                : null
              }
              </>
              <textarea ref={formRef} onChange={(e) => {
                  crypt(e.target.value, cryptFuncType, toCrypt, setEncryptContent, cryptKey)}
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
      
      </footer>
    </div>
  );
}
