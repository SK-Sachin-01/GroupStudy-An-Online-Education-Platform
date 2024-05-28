import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import {Link} from "react-router-dom";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import "../App.css";
import TimeLineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from "../components/common/Footer"
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from "../components/common/ReviewSlider"


const Home = () => {
  return (
    <div>

        {/* Section 1 */}
        <div className='w-11/12 max-w-maxContent flex flex-col gap-5 items-center justify-center relative mx-auto text-white '>
            
            <Link to={"/signup"} >
                <div className='mt-14 flex gap-2 items-center justify-center mx-auto py-2 px-4 rounded-full w-fit 
                bg-richblue-800 text-richblack-200 font-bold transition-all duration-200 hover:scale-95 hover:bg-richblue-900 '>
                    <p>Become an Instructor</p>
                    <FaArrowRight/>
                </div>
            </Link>

            <div className='text-center font-semibold text-3xl'>
                Empower Your Future with 
                <HighlightText text={"Coding Skills"} />
            </div>

            <div className='w-[65%] text-center text-richblack-300'>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            <div className='flex gap-5'>
                <CTAButton active={true} linkto={"/signup"} >
                    Learn More
                </CTAButton>
                <CTAButton active={false} linkto={"/login"} >
                    Book a Demo
                </CTAButton>
            </div>

            <div className='w-[80%]'>
                <video muted loop autoPlay >
                    <source src={Banner} type='video/mp4' />
                </video>
            </div>

            <div>
                <CodeBlocks
                    position={"lg:flex-row"}
                    heading={
                    <div className="text-4xl font-semibold">
                        Unlock your
                        <HighlightText text={"coding potential"} /> with our online
                        courses.
                    </div>
                    }
                    subheading={
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabtn1={{
                    btnText: "Try it Yourself",
                    link: "/signup",
                    active: true,
                    }}
                    ctabtn2={{
                    btnText: "Learn More",
                    link: "/signup",
                    active: false,
                    }}
                    codeColor={"text-yellow-25"}
                    codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                    backgroundGradient={<div className="codeblock1 absolute"></div>}
                />
            </div>

            <div>
            <CodeBlocks
                position={"lg:flex-row-reverse"}
                heading={
                <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                    Start
                    <HighlightText text={"coding in seconds"} />
                </div>
                }
                subheading={
                "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                }
                ctabtn1={{
                btnText: "Continue Lesson",
                link: "/signup",
                active: true,
                }}
                ctabtn2={{
                btnText: "Learn More",
                link: "/signup",
                active: false,
                }}
                codeColor={"text-white"}
                codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                backgroundGradient={<div className="codeblock2 absolute"></div>}
            />
        </div>

            <ExploreMore/>

        </div>
        
        {/* Section 2 */}
        <div className=' bg-pure-greys-5 text-richblack-700 '>
            <div className='homepage_bg'>
                <div className=' w-11/12 h-[325px] max-w-maxContent flex items-center justify-center gap-5 mx-auto text-white ' >
                    <CTAButton active={true} linkto={"/signup"} >
                        <div className='flex gap-2 items-center'>
                            Explore full Catalog
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                    <CTAButton active={false} linkto={"/login"} >
                        Learn More
                    </CTAButton>
                </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 '>
                <div className='w-[100%] flex justify-between my-16 gap-20'>
                    <div className='w-[50%] text-3xl font-bold'>
                        Get the skills you need for a
                        <HighlightText text={"job that is in demand."} />
                    </div>
                    <div className='w-[50%] flex flex-col items-start gap-5'>
                        <div className='font-semibold'>
                        The modern GroupStudy is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>
                        <CTAButton active={true} linkto={"/signup"} >
                            Learn More
                        </CTAButton>
                    </div>
                </div>

                <TimeLineSection/>

                <LearningLanguageSection/>

            </div>


        </div>

        {/* Section 3 */}
        <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Become a instructor section */}
        <InstructorSection />

        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

        <Footer/>

    </div>
  )
}

export default Home