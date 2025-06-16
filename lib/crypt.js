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

  function feistelSypher({text, key='sfasfsfaf', rounds=16, crypt=true}) {

    const F = (str, k) => {
      console.log(str, k)
      let result = '';
      for (let j = 0; j < str.length; j++) {
        result += String.fromCharCode(str.charCodeAt(j) ^ k.charCodeAt(j % k.length));
      }
      return result
    }
    text = (text.length % 2 == 1) ? text + ' ' : text;
    let L = text.slice(0, text.length / 2);
    let R = text.slice(text.length / 2);

    if (!crypt) {
      key = key.split().reverse().join('');
    }

    for (let i = 0; i < rounds; i++) {

      const tempR = R;
      R = xorStrings(L, F(R, key[i % key.length]));
      L = tempR;
    }

    return L + R;
  }

  function xorStrings(a, b) {
    console.log(a, b)
    let result = '';
    for (let i = 0; i < a.length; i++) {
      result += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i % b.length));
    }

    return result;
  }
  function other(content, setWindowContent) {
    return ' Это будет вывод другой функции'
  }
  function crypt(content, cryptType, toCrypt, setWindowContent) {
    let res; 
    console.log(content, cryptType, toCrypt, setWindowContent)
    if (cryptType === 0) {
      res = permutation(content, toCrypt);
    } else if (cryptType === 1) {
      res = feistelSypher({
        text: content,
        crypt: toCrypt
      })
    } else if (cryptType === 2) {
      res = other();
    } else {
      res = other()
    }
    setWindowContent(res);
  }

export default crypt;