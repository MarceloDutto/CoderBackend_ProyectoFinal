export default class userDTO {
    constructor(doc) {
        this.id = doc._id? doc._id : doc.id,
        this.name = doc.first_name,
        this.lastname = doc.last_name,
        this.fullname = doc.first_name + ' ' + doc.last_name,
        this.avatar = doc.profile_picture,
        this.email = doc.email,
        this.role = doc.role
    }
};