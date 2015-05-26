/**
* The module genarates chain's hash for getting signs.
**/
function chainhash() {
  var crypto = require('crypto');
  const BN = require('bn.js');
  var prime = new BN(31);

  function chainHash(string, parentHash){
    var md5 = crypto.createHash('md5').update(string).digest('hex');
    if(parentHash){
      var hashcode = new BN(md5,16);
      var parentHashCode= new BN(parentHash,16);
      var mult = parentHashCode.mul(prime);
      hashcode = mult.add(hashcode);
      md5 = hashcode.toString(16);
      md5 = md5.substring(md5.length-32,md5.length);
    }

    return md5;
  }

  return {
    hashCode:function(string, parentHash){
      return chainHash(string, parentHash);
    }
  }
}

module.exports = chainhash();