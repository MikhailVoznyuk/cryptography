  function permutation(content, setWindowContent) {
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

  function crypt() {
    
  }