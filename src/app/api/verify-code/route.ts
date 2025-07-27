import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    dbConnect();
    try{
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        const isCodeValid = user.verifyCode === code;
        console.log("isCodeValid", isCodeValid);
        console.log("user.verifyCode", user.verifyCode);
        console.log("code", code);
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                message: "User verified successfully",
                success: true,
            }, { status: 200 });
        }else if(!isCodeNotExpired){
            return Response.json({
                message: "Verification code has expired, plsease signup again to get a new code",
                success: false,
            }, { status: 400 });
        }else{
            return Response.json({
                message: "Invalid code",
                success: false,
            }, { status: 400 });
        }

    }catch (error) {
        console.error("Error verifying user", error);
        return new Response("Error verifying user", { status: 500 });
    }

}