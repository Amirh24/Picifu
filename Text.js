function Text (settings) {
    this.text = settings.text || "";
    this.x = settings.x || 240;
    this.y = settings.y || 50;
    this.color = settings.color || "#000000" ;
    this.fontSize  = settings.fontSize || 36;
    this.strokeSize = settings.strokeSize || 2;
    this.strokeColor = settings.strokeColor || "#000000" ;
}
 
 
 
 
 /*
// anti-pattern! keep reading...
function getAppleInfo() {
    return this.color + ' ' + this.type + ' apple';
}

*/