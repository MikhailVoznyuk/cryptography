'use client'

import React from "react";
import Image from "next/image";
import styles from "./page.module.css";

import CopyToClipBoardButton from "@/components/copyButton";
import crypt from "@/lib/crypt";
import { generateRsaKeys } from "@/lib/crypt";

export default function Home() {
  
  const [encryptContent, setEncryptContent] = React.useState('');
  const [baseContent, setBaseContent] = React.useState('');
  const [toCrypt, setToCrypt] = React.useState(true);
  const [cryptFuncType, setCryptFuncType] = React.useState(0);
  const [cryptKey, setCryptKey] = React.useState(null);
  const [cryptMask, setCryptMask] = React.useState(null);
  const [rsaKeys, setRsaKeys] = React.useState(null);
  const userInput = React.useRef();
  const maskInput = React.useRef();
  const feistKeyInput = React.useRef();
  const rsaOpenKeyInput = React.useRef();
  const rsaPrivateKeyInput = React.useRef();
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <div className={styles.container}>
          <div className={styles.col}>
            <form className={styles.mainForm}>
              <select name="type" onChange={e => {
                setToCrypt(Boolean(+e.target.value));
                setCryptKey(null);
                setCryptMask(null);
                setRsaKeys(null);
                setEncryptContent(null);
                if (userInput?.current?.value) {
                  userInput.current.value = ''
                };
                if (maskInput?.current?.value) {
                  maskInput.current.value = ''
                };
                if (feistKeyInput?.current?.value) {
                  feistKeyInput.current.value = ''
                };
                if (rsaOpenKeyInput?.current?.value) {
                  rsaOpenKeyInput.current.value = ''
                };
                if (rsaPrivateKeyInput?.current?.value) {
                  rsaPrivateKeyInput.current.value = ''
                };
    
              }}>
                <option value={1}>Шифрование</option>
                <option value={0}>Дешифрование</option>
              </select>
              <select name='cryptFunc' onChange={e => {
                const cryptFuncType = e.target.value;
                setCryptFuncType(+cryptFuncType);
                setToCrypt(Boolean(+e.target.value));
                setCryptKey(null);
                setCryptMask(null);
                setRsaKeys(null);
                setEncryptContent(null);
                if (userInput?.current?.value) {
                  userInput.current.value = ''
                };
                if (maskInput?.current?.value) {
                  maskInput.current.value = ''
                };
                if (feistKeyInput?.current?.value) {
                  feistKeyInput.current.value = ''
                };
                if (rsaOpenKeyInput?.current?.value) {
                  rsaOpenKeyInput.current.value = ''
                };
                if (rsaPrivateKeyInput?.current?.value) {
                  rsaPrivateKeyInput.current.value = ''
                };
               
              }}>
                <option value='0'>Перестановка</option>
                <option value='1'>Шифр Фейнстеля</option>
                <option value='2'>Гамма шифрование</option>
                <option value='3'>RSA шифрование</option>
              </select>
              <>
              { (cryptFuncType == 1) ? 
                <input placeholder="Введите ключ" ref={feistKeyInput} onChange={(e) => {
                  setCryptKey(e.target.value)
                }}></input>
                : null
              }
              { (cryptFuncType == 2 && !toCrypt) ? 
                <input placeholder="Введите гамма-маску" ref={maskInput} onChange={
                  (e) => setCryptMask(e.target.value)
                  }>
                </input> :
                null
              }
              {(cryptFuncType == 3 && toCrypt && !rsaKeys) ?
                <>
                  <input placeholder="Введите открытый ключ" ref = {rsaOpenKeyInput} onChange={
                    (e) => setRsaKeys({
                      publicKey: e.target.value.split(' ')
                  })
                  }></input>
                  <button onClick={() => generateRsaKeys().then(keys => setRsaKeys(keys))}>Сгенерировать ключи</button>
                </> :
               null}
                {(cryptFuncType == 3 && !toCrypt) ?
                <>
                 <input placeholder="Введите закрытый ключ" ref = {rsaPrivateKeyInput} onChange={
                    (e) => setRsaKeys({
                      privateKey: e.target.value.split(' ')
                  })
                  }></input>
                </> :
               null}
              {(cryptFuncType == 3 && toCrypt && rsaKeys?.publicKey && rsaKeys?.privateKey) ?
                <div className={styles.keysBlock}>
                  <div className={styles.keysContainer}>
                     <p>{rsaKeys.publicKey.map(item => item.slice(0, 10) + '…').join(' ')}</p>
                     <span>Открытый ключ</span>
                     <CopyToClipBoardButton text={rsaKeys.publicKey.join(' ')}></CopyToClipBoardButton>
                  </div>
                  <div className={styles.keysContainer}>
                    <p>{rsaKeys.privateKey.map(item => item.slice(0, 10) + '…').join(' ')}</p>
                    <span>Закрытый ключ</span>
                    <CopyToClipBoardButton text={rsaKeys.privateKey.join(' ')}></CopyToClipBoardButton>
                  </div>
                </div> : 
                null
              }
              </>
              <textarea ref={userInput} onChange={(e) => {
                  switch (cryptFuncType) {
                    case 2:
                      if (toCrypt) {
                        const output = crypt(e.target.value, cryptFuncType, toCrypt, setEncryptContent, cryptKey, null);
                        setCryptMask(output[1]);
                      } else {
                        crypt(e.target.value, cryptFuncType, toCrypt, setEncryptContent, cryptKey, cryptMask);
                      }
                      
                
                      break;
                    case 3:
                      if (toCrypt) {
                        crypt(e.target.value, cryptFuncType, toCrypt, setEncryptContent, rsaKeys.publicKey);
                      } else {
                        crypt(e.target.value, cryptFuncType, toCrypt, setEncryptContent, rsaKeys.privateKey);
                      }
                      break
                    
                    default:
                      crypt(e.target.value, cryptFuncType, toCrypt, setEncryptContent, cryptKey);
                      break
                  }
                }
              } name="content" placeholder="Введите сообщение"></textarea>
   
            </form>
          </div>
          <div className={styles.col}>
            {(cryptMask && cryptFuncType == 2) ? 
                <div className={styles.keysContainer}>
                  <p>{cryptMask.slice(0, 10) + '…'}</p>
                  <CopyToClipBoardButton text={cryptMask}></CopyToClipBoardButton>
                  <span>Скопируйте маску, она нужна для декодирования</span>

                </div> : null}
            { encryptContent ? (
              <div className={styles.resultContainer} style={(cryptMask && cryptFuncType == 2) ? {height: 'calc(100% - 50px)'} : null}>
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
