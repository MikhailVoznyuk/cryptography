import { text } from 'node-forge/lib/util';

const forge = require('node-forge');
  
  function permutation(content, type) {
 
    const fromAlph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ .,!:;?-'.split('');
    const toAlph = 'VWXYZ .,!:;?-KLMNOPQRSTUABCDEFGHIJ'.split('');
    let newContent = '';
    let fromMap = new Map();
    let toMap = new Map();
    for (let i = 0; i < fromAlph.length; i++) {
      toMap.set(fromAlph[i], toAlph[i]);
    }
    for (let i = 0; i < toAlph.length; i++) {
      fromMap.set(toAlph[i], fromAlph[i]);
    }
    content = content.toUpperCase();
    
    if (type) {
      for (let s of content) {
        newContent += (toMap.get(s) == undefined) ? ' ' : toMap.get(s);
      
      }
    } else {
      for (let s of content) {
        newContent += (fromMap.get(s) == undefined) ? ' ' : fromMap.get(s) ;
      }
    }
    return newContent
    
  }

  function feistelEncrypt({plainText, cryptNeeded=true, key, rounds = 8}) {
   function feistelFunction(data, key) {
    let result = "";

    for (let i = 0; i < data.length; i++) {
        let charCode = data.charCodeAt(i);
        let keyChar = key.charCodeAt(i % key.length);

        // XOR + циклический сдвиг + псевдо-замена
        let mixed = charCode ^ keyChar;
        mixed = ((mixed << 2) | (mixed >> 6)) & 0xff; // циклический сдвиг на 2 бита влево (8-бит)
        mixed = (mixed + 31) % 256; // простая замена (модификация значения)

        result += String.fromCharCode(mixed);
    }

    return result;
}
    function feistelDecrypt(cipherText, key, rounds = 8) {
      let left = cipherText.slice(0, cipherText.length / 2);
      let right = cipherText.slice(cipherText.length / 2);

      for (let i = 0; i < rounds; i++) {
          let newRight = left;
          let newLeft = xorStrings(right, feistelFunction(left, key));
          left = newLeft;
          right = newRight;
      }

    return left + right;
    }
    
    function xorStrings(a, b) {
      let result = "";
      for (let i = 0; i < a.length; i++) {
          result += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i));
      }
      return result;
    } 
    if (!cryptNeeded) {
      return feistelDecrypt(plainText, key)
    }
    if (plainText.length % 2 !== 0) plainText += " ";

    let left = plainText.slice(0, plainText.length / 2);
    let right = plainText.slice(plainText.length / 2);

    for (let i = 0; i < rounds; i++) {
        let newLeft = right;
        let newRight = xorStrings(left, feistelFunction(right, key));
        left = newLeft;
        right = newRight;
    }

    return left + right;
}

 function gammaCrypt({plainText, a, c, b=32, mask=null}) {
    const createGammaMask = (plainText, a, c, b) => {
        const arr = plainText.split('').map(item => item.charCodeAt(0).toString(2));
        let gammaMask = [];
        const RN = Math.round(Math.random() * Math.PI * 100);
        gammaMask.push('0'.repeat(b - 1 -  RN.toString(2).length) +  RN.toString(2))
        for (let i = 1; i < arr.length; i++) {
            const part = (a * gammaMask[i - 1] + c) % 2 ** b;
            if (part.toString(2).length < b) {
                gammaMask.push('0'.repeat(b - 1 - part.toString(2).length) + part.toString(2));
            } else { 
                gammaMask.push(part.toString(2));
            }
            
        }
        gammaMask = gammaMask.map(item => String.fromCharCode(parseInt(item, 2))).join('');
        return gammaMask;
    }
    const encode = (plainText, mask) => {
        let text = plainText.split('').map(item => 
            (item.charCodeAt(0).toString(2).length < b) ?
              '0'.repeat(b - 1 - item.charCodeAt(0).toString(2).length) + item.charCodeAt(0).toString(2) :
              item.charCodeAt(0).toString(2));
        
        mask = mask.split('').map(item => 
            (item.charCodeAt(0).toString(2).length < b) ?
              '0'.repeat(b - 1 - item.charCodeAt(0).toString(2).length) + item.charCodeAt(0).toString(2) :
              item.charCodeAt(0).toString(2));
        
        /* if (mask.toString(2).length < b) {
             mask = mask.split('').map(item => '0'.repeat(b - 1 - item.charCodeAt(0).toString(2).length) + item.charCodeAt(0).toString(2));
        } else {
            mask = mask.split('').map(item => item.charCodeAt(0).toString(2));
        } */
      
        let encodedArr = [];
        for (let i = 0; i < text.length; i++) {
            let encodedPart = ''
            for (let j = 0; j < text[i].length; j++ ) {
                if (+text[i][j] + +mask[i][j] == 1) {
                    encodedPart += '1';
                } else {
                    encodedPart += '0';
                }
            }
            encodedArr.push(encodedPart);
        }
        return encodedArr.map(item => String.fromCharCode(parseInt(item, 2))).join('');
    }
   
    if (mask) {
        return encode(plainText, mask) 
    } else {
        const gammaMask = createGammaMask(plainText, a, c, b);
        const str = encode(plainText, gammaMask);
        return [str, gammaMask];
    }
}

export async function generateRsaKeys(bits = 64) {
  const p = BigInt((await new Promise(resolve => forge.prime.generateProbablePrime(bits, (_, n) => resolve(n)))));
  let q;
  do {
    q = BigInt((await new Promise(resolve => forge.prime.generateProbablePrime(bits, (_, n) => resolve(n)))));
  } while (q === p);

  const n = p * q;
  const phi = (p - 1n) * (q - 1n);

  let e;
  do {
    e = BigInt((await new Promise(resolve => forge.prime.generateProbablePrime(bits / 2, (_, n) => resolve(n)))));
  } while (gcd(e, phi) !== 1n);

  const d = modInverse(e, phi);

  return {
    publicKey: [e.toString(), n.toString()],
    privateKey: [d.toString(), n.toString()]
  };
}

function gcd(a, b) {
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}


function rsa({ plainText, publicKey = null, privateKey = null, encrypt = true }) {
  if (encrypt) {
    const [e, n] = publicKey.map(BigInt);
    const encoded = plainText
      .split('')
      .map(c => modPow(BigInt(c.charCodeAt(0)), e, n).toString());
    return encoded.join(' ');
  } else {
    const [d, n] = privateKey.map(BigInt);
    const numbers = plainText.split(' ').map(BigInt);
    const decoded = numbers
      .map(num => String.fromCharCode(Number(modPow(num, d, n))));
    return decoded.join('');
  }
}


function modInverse(e, phi) {
  let [a, b] = [phi, e];
  let [x0, x1] = [0n, 1n];
  while (b > 0n) {
    const q = a / b;
    [a, b] = [b, a % b];
    [x0, x1] = [x1, x0 - q * x1];
  }
  return x0 < 0n ? x0 + phi : x0;
}

function modPow(base, exponent, mod) {
  let result = 1n;
  base %= mod;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exponent /= 2n;
  }
  return result;
}


function crypt(content, cryptType, toCrypt, setWindowContent, cryptKey, mask) {
  let res; 

  if (cryptType === 0) {
    res = permutation(content, toCrypt);
  } else if (cryptType === 1) {
    res = feistelEncrypt({
      plainText: content,
      cryptNeeded: toCrypt,
      key: cryptKey,
    })
  } else if (cryptType === 2) {
    res = gammaCrypt({
      plainText: content, 
      mask: mask, 
      a: 5,
      c: 5,
      b: 32
    })
    if (mask) {
        setWindowContent(res);
    } else {
        setWindowContent(res[0]);
    }

    return res;
  } else if (cryptType === 3) {
    res = rsa(
      {
        plainText: content,
        publicKey: cryptKey,
        privateKey: cryptKey,
        encrypt: toCrypt
      }
    )
  }
  setWindowContent(res);
  return res;
}

export default crypt;