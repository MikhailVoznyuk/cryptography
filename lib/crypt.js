  function permutation(content, type) {
 
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
    createGammaMask = (plainText, a, c, b) => {
        const arr = plainText.split('').map(item => item.charCodeAt(0).toString(2));
        let gammaMask = [];
        gammaMask.push('0'.repeat(b - 1 -  7..toString(2).length) +  7..toString(2))
        for (let i = 1; i < arr.length; i++) {
            const part = (a * gammaMask[i - 1] + c) % 2 ** b;
            if (part.toString(2).length < b) {
                console.log(part.toString(2).length)
                gammaMask.push('0'.repeat(b - 1 - part.toString(2).length) + part.toString(2));
            } else { 
                gammaMask.push(part.toString(2));
            }
            
        }
        return gammaMask;
    }
    encode = (plainText, mask) => {
        let text;
        if (plainText.toString(2).length < b) {
             text = plainText.split('').map(item => '0'.repeat(b - 1 - item.charCodeAt(0).toString(2).length) + item.charCodeAt(0).toString(2));
        } else {
            text = plainText.split('').map(item => item.charCodeAt(0).toString(2));
        }
        console.log(text)
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
        console.log(encodedArr)
        return encodedArr.map(item => String.fromCharCode(parseInt(item, 2))).join('');
    }
   
    if (mask) {
        return encode(plainText, mask) 
    } else {
        const gammaMask = createGammaMask(plainText, a, c, b);
        const str = encode(plainText, a, c, b);
        return [str, gammaMask];
    }
}



  function crypt(content, cryptType, toCrypt, setWindowContent, cryptKey, mask) {
    let res; 
    console.log(content, cryptType, toCrypt, setWindowContent)
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
    } else {
      res = other()
    }
    setWindowContent(res);
  }

export default crypt;