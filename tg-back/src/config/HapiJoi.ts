import Joi from "joi";

// 갤러리 생성시 입력 값 검증
export const TweetGalleryJoiSchema = Joi.object().keys({
    galleryName: Joi.string().min(1).max(15).required(),
    galleryContent: Joi.string().min(1).max(100).required(),
    galleryLocked: Joi.boolean().required()
})