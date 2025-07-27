import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json()
        
        // Validate the prompt
        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please provide a valid prompt"
                },
                { status: 400 }
            )
        }

        // Generate AI response
        const { text } = await generateText({
            model: openai("o3-mini"),
            prompt: prompt,
            maxTokens: 500, // Limit response length
            temperature: 0.7 // Add some creativity
        })

        return NextResponse.json(
            {
                success: true,
                message: "Response generated successfully",
                data: {
                    prompt: prompt,
                    response: text
                }
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Error generating AI response:", error)
        
        return NextResponse.json(
            {
                success: false,
                message: "If you could instantly teleport to any place in the world for a day, where would you go and why?||What's a song that always lifts your mood, no matter what?||What's a fictional world from a book or movie you would love to explore?"
            },
            { status: 500 }
        )
    }
}