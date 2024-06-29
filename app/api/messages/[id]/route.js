import connectDB from "@/config/database";
import MessageModel from "@/models/MessageModel";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

// PUT /api/messages/:id 
export const PUT = async (request, { params }) => {
    try {
        await connectDB();

        const { id } = params;

        const sessionUser = await getSessionUser();
    
        if (!sessionUser || !sessionUser.user) {
          return new Response('User ID is required', {status: 401});
        }
    
        const { userId } = sessionUser;

        const message = await MessageModel.findById(id);
        if (!message) return new Response('Message Not Found', {status: 404});

        //* Verify ownership (very important, to avoid anybody to be able to change this)
        if (message.recipient.toString() !== userId) {
            return new Response('Unauthorized', {status: 401});
        }

        //* Update message to read / unread depending on the current status of the message
        message.read = !message.read;
        await message.save();

        return new Response(JSON.stringify(message), {status: 200});

    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', {status: 500});
    }
};

// DELETE /api/messages/:id 
export const DELETE = async (request, { params }) => {
    try {
      await connectDB();
  
      const { id } = params;
  
      const sessionUser = await getSessionUser();
  
      if (!sessionUser || !sessionUser.user) {
        return new Response('User ID is required', {
          status: 401,
        });
      }
  
      const { userId } = sessionUser;
  
      const message = await MessageModel.findById(id);
  
      if (!message) return new Response('Message Not Found', { status: 404 });
  
     //* Verify ownership (very important, to avoid anybody to be able to change this)
      if (message.recipient.toString() !== userId) {
        return new Response('Unauthorized', { status: 401 });
      }
  
      await message.deleteOne();
  
      return new Response('Message Deleted', { status: 200 });
    } catch (error) {
      console.log(error);
      return new Response('Something went wrong', { status: 500 });
    }
  };