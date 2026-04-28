import { Request, Response } from "express";
import Stripe from "stripe";
import Course from "../models/course";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
});

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",

            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: course.title,
                        },
                        unit_amount: Math.round(course.price * 100), // cents
                    },
                    quantity: 1,
                },
            ],

            success_url: `${process.env.CLIENT_URL}/success?courseId=${course._id}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Stripe error" });
    }
};