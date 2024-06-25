import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("This is required!"),
    body("city").notEmpty().withMessage("This is required!"),
    body("country").notEmpty().withMessage("This is required!"),
    body("description").notEmpty().withMessage("This is required!"),
    // body("type").notEmpty().withMessage("This is required!"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("This is required, and must be number!"),
    body("facilities").notEmpty().isArray().withMessage("This is required!"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imagefiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageUrls = await uploadImages(imagefiles);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;
      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel);
    } catch (error) {
      console.log("error creating hotel: ", error);
      res.status(500).json({ message: "something wrong!" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels at the backend" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();

  try {
    const hotels = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels at the backend" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updateHotel: HotelType = req.body;
      updateHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updateHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found!" });
      }

      const files = req.files as Express.Multer.File[];
      const updateImageUrls = await uploadImages(files);

      hotel.imageUrls = [...updateImageUrls, ...(updateHotel.imageUrls || [])];
      await hotel.save();
      res.status(201).json(hotel);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error update image for hotels at the backend" });
    }
  }
);

export default router;

async function uploadImages(imagefiles: Express.Multer.File[]) {
  const uploadPromises = imagefiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
