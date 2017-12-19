
let utils;

utils = {

  getTypeRef($event) {
    let path = $event.path, typeRef;

    while( path.length>2 ){
      typeRef = (path[0] &&path[0].getAttribute('type-ref'));
      if(typeRef) {
        return typeRef
      };
      path.shift()
    }
    return ''
  }
  
}

export default utils;