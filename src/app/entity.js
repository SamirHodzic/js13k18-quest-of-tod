export default class Entity {
  constructor(data) {
    this.gid = data.gid - 1;
    this.x = data.x * 4;
    this.y = data.y * 4 - 32;
    this.cX = (data.properties || {}).cX || null;
    this.cY = (data.properties || {}).cY || null;
    this.key_id = (data.properties || {}).key_id || null;
    this.message_id = (data.properties || {}).message_id || null;
    this.scroll_id = (data.properties || {}).scroll_id || null;
    this.finish_id = (data.properties || {}).finish_id || null;
    this.collected = false;
    this.type = data.gid == 41 ? 'key' : data.gid == 43 || data.gid == 44 ? 'door' : data.gid == 40 ? 'message' : data.gid == 1 ? 'floor' : 'scroll';
    this.message = (data.properties || {}).message || null;
  }
}
