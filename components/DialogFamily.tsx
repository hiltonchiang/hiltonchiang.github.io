'use client'
import { Fragment, useState, useRef, useEffect, FormEvent } from 'react'
import mermaid from 'mermaid'
import { useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import parse from 'parse-svg-path'
import * as d3 from 'd3'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { RadioGroup, Transition } from '@headlessui/react'
import clsx from 'clsx'

type Props = { flag: boolean }
interface OptionObj {
  label: string
  option: string
}
interface CellObj {
  question: string
  options: OptionObj[]
  answer: string
}
const QArray: CellObj[] = [
  {
    question: '蔣家的起源是在那裏？',
    options: [
      { label: '浙江奉化', option: 'op1' },
      { label: '重慶潼南', option: 'op2' },
      { label: '臺灣高雄', option: 'op3' },
      { label: '江蘇宜興', option: 'op4' },
    ],
    answer: 'op2',
  },
  {
    question: '老奶的出生地是在那裏？',
    options: [
      { label: '潼南雙江', option: 'op1' },
      { label: '高雄橋頭', option: 'op2' },
      { label: '北京三環', option: 'op3' },
      { label: '重慶江北', option: 'op4' },
    ],
    answer: 'op1',
  },
  {
    question: '老爺爺最後葬在那裏？',
    options: [
      { label: '潼南雙江', option: 'op1' },
      { label: '金寶山', option: 'op2' },
      { label: '新北關音山', option: 'op3' },
      { label: '福德公墓', option: 'op4' },
    ],
    answer: 'op3',
  },
  {
    question: '按字輩，老爺爺是什麼字輩？',
    options: [
      { label: '仁字輩', option: 'op1' },
      { label: '必字輩', option: 'op2' },
      { label: '愈字輩', option: 'op3' },
      { label: '德字輩', option: 'op4' },
    ],
    answer: 'op2',
  },
  {
    question: '老爺爺是入臺第一代，若從入川算起他該是第幾代？',
    options: [
      { label: '入川第五代', option: 'op1' },
      { label: '入川第六代', option: 'op2' },
      { label: '入川第七代', option: 'op3' },
      { label: '入川第八代', option: 'op4' },
    ],
    answer: 'op4',
  },
  {
    question: '老爺爺是入臺第一代，現在蔣家在臺已繁衍到了第幾代？',
    options: [
      { label: '第二代', option: 'op1' },
      { label: '第三代', option: 'op2' },
      { label: '第四代', option: 'op3' },
      { label: '第五代', option: 'op4' },
    ],
    answer: 'op3',
  },
  {
    question: '老爺爺和老奶是那一年來臺灣的？',
    options: [
      { label: '1950', option: 'op1' },
      { label: '1949', option: 'op2' },
      { label: '1953', option: 'op3' },
      { label: '1948', option: 'op4' },
    ],
    answer: 'op2',
  },
  {
    question: '我們是那一年搬到臺北天母的？',
    options: [
      { label: '1980', option: 'op1' },
      { label: '1981', option: 'op2' },
      { label: '1990', option: 'op3' },
      { label: '1992', option: 'op4' },
    ],
    answer: 'op2',
  },
  {
    question: '我們以前住的個眷村叫那個眷村',
    options: [
      { label: '婦聯六村', option: 'op1' },
      { label: '南京新村', option: 'op2' },
      { label: '松山新村', option: 'op3' },
      { label: '四四東村', option: 'op4' },
    ],
    answer: 'op2',
  },
]

const pswdString = '266-14-2'

const clsNext =
  'inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400 sm:ml-3 sm:w-auto'

const clsSubmit =
  'inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto'

const clsExit =
  'inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-400 sm:ml-3 sm:w-auto'

function shuffleArray(array) {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}

function getDataBlur() {
  let flag = false
  const divs = d3.selectAll('main').selectAll('div')
  const nodes = divs.nodes()
  for (let i = 0; i < nodes.length; i++) {
    const id = d3.select(nodes[i]).attr('id')
    if (id === 'main-family-page') {
      const blur = d3.select(nodes[i]).attr('data-blur')
      if (blur === 'true') {
        flag = true
      } else {
        flag = false
      }
    }
  }
  return flag
}

function setDataBlur(flag) {
  const divs = d3.selectAll('main').selectAll('div')
  const nodes = divs.nodes()
  for (let i = 0; i < nodes.length; i++) {
    const id = d3.select(nodes[i]).attr('id')
    if (id === 'main-family-page') {
      d3.select(nodes[i]).attr('data-blur', flag)
    }
  }
}

/*
 * main program to return Dialog in sequence
 */
interface RidxProp {
  index: number
  option: string
}

const DialogFamily = () => {
  /* consts */
  const [openRadio, setOpenRadio] = useState(getDataBlur())
  const [openLogIn, setOpenLogIn] = useState(getDataBlur())
  const [eyeSlash, setEyeSlash] = useState(false)
  const [pswdWrong, setPswdWrong] = useState(false)
  const [selectedOption, setSelectedOption] = useState('op1')
  const [ridx, setRidx] = useState({ index: 0, option: '' })
  const [shuffledQArray, setShuffledQArray] = useState({ array: [] })
  const [nextButtonClassName, setNextButtonClassName] = useState(
    clsNext + ' ' + 'cursor-not-allowed'
  )
  const [scores, setScores] = useState({ no: 0 })
  const [submitButtonClassName, setSubmitButtonClassName] = useState(clsSubmit)
  const [answer, setAnswer] = useState(true)
  const [qStart, setQStart] = useState(true)
  const [nextDisabled, setNextDisabled] = useState(true)
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [submittedWrong, setSubmittedWrong] = useState(false)
  const [radioDisabled, setRadioDisabled] = useState(false)
  const [prompt, setPrompt] = useState('')
  const curGroups: CellObj =
    shuffledQArray.array.length > 0 ? shuffledQArray.array[ridx.index] : QArray[ridx.index]
  console.log('DialogFamily IN. ridx.index', ridx.index)
  /** functions */
  const handleNextButton = () => {
    setQStart(true)
    setNextButtonClassName(clsNext + ' ' + 'cursor-not-allowed')
    setNextDisabled(true)
    setSubmitDisabled(false)
    setSubmitButtonClassName(clsSubmit)
    if (++ridx.index === shuffledQArray.array.length) ridx.index = 0
    setRadioDisabled(false)
    setPrompt('「 」')
    setSelectedOption('op1')
  }
  const fadeOutMainPage = () => {
    return
    gsap.set('#main-family-page', { opacity: 0 })
    gsap.to('#main-family-page', {
      duration: 1,
      opacity: 1,
      ease: 'sine.inOut',
    })
  }
  const FadeInLoginOutDialogRadio = () => {
    gsap.set('#dialog-logging', { opacity: 1 })
    gsap.to('#dialog-logging', {
      duration: 1,
      opacity: 0,
      ease: 'sine.inOut',
      onComplete: () => {
        gsap.set('#dialog-group-option', { opacity: 0 })
        gsap.to('#dialog-group-option', {
          duration: 1,
          opacity: 1,
          ease: 'sine.inOut',
        })
        setOpenLogIn(false)
      },
    })
  }
  const handleSubmitButton = async () => {
    setQStart(false)
    setNextButtonClassName(clsNext)
    setNextDisabled(false)
    setSubmitDisabled(true)
    setSubmitButtonClassName(clsSubmit + ' ' + 'cursor-not-allowed')
    if (selectedOption === curGroups.answer) {
      scores.no += 10
      setAnswer(true)
      setSubmittedWrong(false)
      setRadioDisabled(true)
    } else {
      setAnswer(false)
      setSubmittedWrong(true)
      setRadioDisabled(false)
    }
    for (let i = 0; i < curGroups.options.length; i++) {
      if (curGroups.answer === curGroups.options[i].option) {
        setPrompt('「' + curGroups.options[i].label + '」')
        break
      }
    }
    // if (scores.no >= 60) {
    //   removeBlur()
    // }
  }

  const handleLogIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent default page refresh

    const form = event.currentTarget
    const formData = new FormData(form)

    // Access individual values by input name
    const password = formData.get('password') as string
    console.log('password', password)
    // Convert FormData to a plain object for easier manipulation
    const data = Object.fromEntries(formData.entries())
    console.log('Form data:', data)
    if (password === pswdString) {
      setOpenLogIn(false)
      setPswdWrong(false)
    } else {
      setPswdWrong(true)
    }
  }

  const handleExitButton = async () => {
    //gsap.set('#dialog-group-option', { opacity: 1 })
    //gsap.to('#dialog-group-option', {
    //  duration: 1,
    //  opacity: 0,
    //  ease: 'sine.inOut',
    //  onComplete: () => {
    setOpenRadio(false)
    removeBlur()
    fadeOutMainPage()
    //  },
    //})
  }

  function ResultLogIn() {
    if (pswdWrong === true) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          data-slot="icon"
          aria-hidden="true"
          className="size-6 text-red-400"
        >
          <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    } else {
      return
    }
  }

  function EyeLid() {
    if (!eyeSlash) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          data-slot="icon"
          aria-hidden="true"
          className="size-6 text-red-400"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setEyeSlash(true)
          }}
        >
          <path
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      )
    } else {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          data-slot="icon"
          aria-hidden="true"
          className="size-6 text-red-400"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setEyeSlash(false)
          }}
        >
          <path
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    }
  }

  function Result() {
    if (qStart) {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          data-slot="icon"
          aria-hidden="true"
          className="size-6 text-blue-400"
        >
          <path
            d="m11.99 7.5 3.75-3.75m0 0 3.75 3.75m-3.75-3.75v16.499H4.49"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    } else {
      if (answer === true) {
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            data-slot="icon"
            aria-hidden="true"
            className="size-6 text-green-400"
          >
            <path d="m4.5 12.75 6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      } else {
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            data-slot="icon"
            aria-hidden="true"
            className="size-6 text-red-400"
          >
            <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      }
    }
  }

  const handleChange = (newOption) => {
    setSelectedOption(newOption)
    if (submittedWrong === true) {
      setNextButtonClassName(clsNext + ' ' + 'cursor-not-allowed')
      setNextDisabled(true)
      setSubmitDisabled(false)
      setSubmitButtonClassName(clsSubmit)
      setQStart(true)
    }
  }

  function removeBlur() {
    const divs = d3.selectAll('main').selectAll('div')
    const nodes = divs.nodes()
    for (let i = 0; i < nodes.length; i++) {
      const id = d3.select(nodes[i]).attr('id')
      if (id === 'main-family-page') {
        d3.select(nodes[i]).attr('data-blur', 'false')
        d3.select(nodes[i]).attr('class', '')
        break
      }
    }
  }
  /* useEffec */
  useEffect(() => {
    if (shuffledQArray.array.length === 0) shuffledQArray.array = shuffleArray(QArray)
    gsap.registerPlugin(MotionPathPlugin)
  }, [shuffledQArray])

  const DialogLogIn = () => {
    return (
      <>
        <Dialog
          open={openLogIn}
          onClose={() => console.log('onClose')} // escape or click out side of panel
          id="dialog-logging"
          aria-labelledby="dialog-title"
          className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
        >
          <DialogBackdrop className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-900/50 backdrop-blur-lg transition-opacity"></DialogBackdrop>
          <div className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <DialogPanel className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                    請輸入通關密碼
                  </h2>
                </div>

                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form onSubmit={handleLogIn} action="#" method="POST" className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="mx-auto flex size-4 shrink-0 animate-bounce items-center justify-center rounded-full bg-lime-500/10 sm:mx-0 sm:size-5">
                          <ResultLogIn />
                        </div>
                        <button className="mx-auto flex size-4 shrink-0 items-center justify-center rounded-full bg-lime-500/10 sm:mx-0 sm:size-5">
                          <EyeLid />
                        </button>
                      </div>
                      <div className="mt-2">
                        <input
                          id="password"
                          name="password"
                          type={eyeSlash ? 'password' : 'text'}
                          required
                          autoComplete="current-password"
                          className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        提交
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    )
  }
  const DialogRadio = () => {
    return (
      <>
        <Dialog
          open={openRadio}
          onClose={() => console.log('onClose')} // escape or click out side of panel
          id="dialog-group-option"
          aria-labelledby="dialog-title"
          className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
        >
          <DialogBackdrop className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-900/50  backdrop-blur-lg transition-opacity"></DialogBackdrop>
          <div className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
            <DialogPanel className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      data-slot="icon"
                      aria-hidden="true"
                      className="size-6 text-red-400"
                    >
                      <path
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 id="dialog-title" className="text-base font-semibold text-white">
                      Question
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">{curGroups.question}</p>
                    </div>
                    <div className="mt-2">
                      <RadioGroup
                        value={selectedOption}
                        onChange={handleChange}
                        disabled={radioDisabled}
                        className="mt-4"
                      >
                        {curGroups.options.map((O) => (
                          <RadioGroup.Option
                            key={O.label}
                            value={O.option}
                            className="flex cursor-pointer items-center space-x-2"
                          >
                            {({ checked }) => (
                              <>
                                <span
                                  className={`h-4 w-4 rounded-full border ${checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                                />
                                <RadioGroup.Label>{O.label}</RadioGroup.Label>
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap bg-gray-700/25 px-4 py-3 sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  id="nextButton"
                  onClick={handleNextButton}
                  className={nextButtonClassName}
                  disabled={nextDisabled}
                >
                  換題
                </button>
                <button
                  type="button"
                  id="submitButton"
                  onClick={handleSubmitButton}
                  className={submitButtonClassName}
                  disabled={submitDisabled}
                >
                  提交
                </button>
                <button
                  type="button"
                  id="submitButton"
                  onClick={handleExitButton}
                  className={clsExit}
                >
                  離開
                </button>
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-lime-500/10 sm:mx-0 sm:size-10">
                  <span>{scores.no}</span>
                </div>
                <div className="mx-auto flex size-12 shrink-0 animate-bounce items-center justify-center rounded-full bg-lime-500/10 sm:mx-0 sm:size-10">
                  <Result />
                </div>
                <div className="mx-auto flex items-center justify-center bg-lime-500/10 sm:mx-0">
                  <span>{prompt}</span>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    )
  }
  /* return */
  return (
    <>
      <DialogRadio />
      <DialogLogIn />
    </>
  )
}
export default DialogFamily
