import connectDB from "@/config/database";
import MessageModel from "@/models/MessageModel";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

// GET /api/messages
export const GET = async () => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify('User ID is required'), {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    const readMessages = await MessageModel.find({ recipient: userId, read: true })
      .sort({ createdAt: -1 }) // Sort read messages in descending order (newest first)
      .populate('sender', 'username')
      .populate('property', 'name');

    const unreadMessages = await MessageModel.find({
      recipient: userId,
      read: false,
    })
      .sort({ createdAt: -1 }) // Sort read messages in descending order (newest first)
      .populate('sender', 'username')
      .populate('property', 'name');

    const messages = [...unreadMessages, ...readMessages];

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};

// POST /api/messages
export const POST = async (request) => {

    try {
        await connectDB();

        const { name, email, phone, message, property, recipient } = await request.json();

        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.user) {
            return new Response(JSON.stringify('You must be logged in to send a message'), {
              status: 401,
            });
          }
      
          const { user } = sessionUser;

          // Cannot sent message to self 
          if(user.id === recipient) {
            return new Response(JSON.stringify({message: 'Cannot message yourself'}), {status: 400})
          }

          const newMessage = new MessageModel({
            sender: user.id,
            recipient,
            property,
            name,
            email,
            phone,
            body: message
          });

          await newMessage.save();

          return new Response(JSON.stringify({message: 'Message sent'}), {status: 200});

    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', {status: 500});
    }
};