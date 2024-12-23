"use client";

import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "../components/ui/Button"
import { ArrowRight, Github, Play, Square, Twitter } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog"
import { cn } from "@/lib/utils"
import dynamic, { noSSR } from "next/dynamic"
import Link from "next/link";

const Landing = () => {
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })

  return (
    <>
    <div className="bg-white justify-center items-center flex text-black">
      <LoginDialog open={open} setOpen={setOpen} />
      <div className="my-24 flex w-full max-w-screen-lg flex-col items-center">
        <div className="relative">
          <DisplayCursor
            pos="md:top-5 top-3 md:left-36 sm:left-32 left-28"
            color="#2447e3"
            message="Hey 👋"
          />
          <DisplayCursor
            pos="md:top-10 top-8 md:right-48 sm:right-44 right-40"
            color="#ef4444"
            message="Hello 🙋‍♂️"
          />

          <div className="text-center font-semibold text-5xl mt-[-40px]">
          Real-Time Drawing Collaboration with Friends
          </div>
        </div>
        <div className="mt-8 flex space-x-4">
          <Button
            size="lg"
            className="border-2 bg-black text-white hover:bg-black"
            // onClick={() => signIn("spotify")}
            onClick={() => setOpen(true)}>
            Log in to Draw <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" className="px-4 bg-white border-2">
            <a href="https://github.com/Vineetjassal/scribble/" target="_blank" rel="noreferrer" tabIndex={-1}>
            <Github className="h-4 w-4 font-semibold text-black" />
            </a>
          </Button>
        </div>
        <div className="relative mt-12 aspect-square w-full max-w-screen-md overflow-hidden rounded-2xl bg-zinc-900 shadow-xl lg:aspect-video mb-[-70px]">
          <Button
            onClick={() => setPlaying((prev) => !prev)}
            variant="subtle"
            className="jusitfy-center absolute top-2 right-2 z-10 flex h-8 w-8 items-center rounded-full p-0 mix-blend-difference">
            {playing ? (
              <Square className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 pl-0.5" />
            )}
          </Button>
          <ReactPlayer
            className="min-h-full min-w-full object-cover"
            url="scribbledemo.mp4"
            controls={false}
            loop
            playing={playing}
          />
        </div>
      </div>
      </div>
    </>
  )
}

const LoginDialog = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  function signIn(arg0: string): void {
    throw new Error("Function not implemented.")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Want to try Scribblesaga?</DialogTitle>
          <DialogDescription className="p-4 px-0 text-neutral-600">
          Before starting your drawing, please head to GitHub and give a star if you like this, and don't forget to follow me on Twitter/LinkedIn! 😁
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid w-full grid-cols-2 gap-x-2">
          <Button className="bg-white text-black border-2">
            <a
              className="flex items-center"
              tabIndex={-1}
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/vineetjassal">
              <Twitter className="mr-2 h-4 w-4" />
              @vineetjassal
            </a>
          </Button>
          <Button type="submit" className="border-2 bg-black text-white hover:bg-black">
          <Link href="/signin" tabIndex={-1} className="flex">
              Draw Now <ArrowRight className="ml-2 h-4 w-4 mt-[2px]" />
          </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const DisplayCursor = ({
  color,
  message,
  pos,
}: {
  color: string
  message: string
  pos: string
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-[1000] hidden animate-bounce md:block",
        pos
      )}>
      <svg
        className="relative"
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        stroke="white"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
        />
      </svg>
      <div
        className="absolute top-5 left-2 rounded-lg p-0.5"
        onKeyUp={(e) => e.stopPropagation()}
        style={{ backgroundColor: color }}>
        <p className="max-w-[14.5rem] overflow-hidden text-ellipsis whitespace-nowrap px-1 text-sm leading-relaxed text-white">
          {message}
        </p>
      </div>
    </div>
    
  )
  
}

export default Landing