import mongoose, { Schema, Document } from 'mongoose';

export interface IUrl extends Document {
  shortId: string;
  longUrl: string;
}

const urlSchema: Schema = new Schema({
  shortId: { type: String, required: true },
  longUrl: { type: String, required: true }
});

urlSchema.index({'shortId': 1}, {unique: true});
urlSchema.index({'longUrl': 1}, {unique: true});

const Url = mongoose.model<IUrl>('Url', urlSchema);

export default Url;