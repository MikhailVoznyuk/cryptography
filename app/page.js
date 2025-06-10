'use client'

import React from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  function crypt(content, setWindowContent) {
    const type = cryptType;
    const fromAlph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ .,!:;?-'.split('');
    const toAlph = 'VWXYZ .,!:;?-KLMNOPQRSTUABCDEFGHIJ'.split('');
    let newContent = '';
    console.log(fromAlph, toAlph)
    let fromMap = new Map();
    let toMap = new Map();
    for (let i = 0; i < fromAlph.length; i++) {
      toMap.set(fromAlph[i], toAlph[i]);
    }
    for (let i = 0; i < toAlph.length; i++) {
      fromMap.set(toAlph[i], fromAlph[i]);
    }
    content = content.toUpperCase();
    
    if (type == 'to') {
      for (let s of content) {
        newContent += (toMap.get(s) == undefined) ? ' ' : toMap.get(s);
      
      }
    } else {
      for (let s of content) {
        newContent += (fromMap.get(s) == undefined) ? ' ' : fromMap.get(s) ;
      }
    }
  
    setWindowContent(newContent);
  }
  const [encryptContent, setEncryptContent] = React.useState('');
  const [baseContent, setBaseContent] = React.useState('');
  const [cryptType, setCryptType] = React.useState('to');
  const [cryptFunction, setCryptFunction] = React.useState(0);
  const formRef = React.useRef();
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <div className={styles.container}>
          <div className={styles.col}>
            <form className={styles.mainForm} action={crypt}>
              <select name="type" onChange={e => {
                setCryptType(e.target.value);
                formRef.current.value = '';
              }}>
                <option value="to">Шифрование</option>
                <option value="from">Дешифрование</option>
              </select>
              <select name='cryptFunc' onchange={e => {
                const cryptFunc = e.current.value;
                setCryptFunction(+cryptFunction);
              }}>
                <option value='0'>Перестановка</option>
                <option value='1'>Что-то еще</option>
              </select>
              <textarea ref={formRef} onChange={(e) => {
     
                
                crypt(e.target.value, setEncryptContent)}
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
