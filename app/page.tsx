'use client';
'use client';
import { LogoIcon } from '@/components/logo-icon';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Chapters } from '@/lib/chapters';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { RoundText } from '@/components/hero/round-text';
import { useIsMobile } from '@/hooks/useMobile';
import { button } from 'motion/react-client';

function CarouselDots({
  api,
  count,
}: {
  api: CarouselApi | undefined;
  count: number;
}) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className="flex gap-2 justify-center mt-4">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => api?.scrollTo(i)}
          className={cn(
            'w-2 h-2 rounded-full transition-colors',
            i === selected ? 'bg-foreground' : 'bg-foreground/30'
          )}
        />
      ))}
    </div>
  );
}

export default function Page() {
  const [api, setApi] = useState<CarouselApi>();
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [isShakaMoved, setIsShakaMoved] = useState(false);
  const [isReadingMe, setIsReadingMe] = useState(false);
  const [isHavingALook, setIsHavingALook] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileCurrentSlide, setMobileCurrentSlide] = useState(0);
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState<'IT' | 'EN'>('IT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // Debug: Log language changes
  useEffect(() => {
    console.log('Current language:', language);
  }, [language]);

  useEffect(() => {
    if (!api) return;

    setCurrentSlide(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!mobileApi) return;

    setMobileCurrentSlide(mobileApi.selectedScrollSnap());

    mobileApi.on('select', () => {
      setMobileCurrentSlide(mobileApi.selectedScrollSnap());
    });
  }, [mobileApi]);

  function goToPrevChapter() {
    if (!api) return;
    api.scrollPrev();
  }

  function goToNextChapter() {
    if (!api) return;
    api.scrollNext();
  }

  function goToPrevChapterMobile() {
    if (!mobileApi) return;
    mobileApi.scrollPrev();
  }

  function goToNextChapterMobile() {
    if (!mobileApi) return;
    mobileApi.scrollNext();
  }

  function contactClick() {
    setIsShakaMoved((prev) => !prev);
  }

  function readMeClick() {
    setIsReadingMe((prev) => !prev);
  }

  function haveLookClick() {
    setIsHavingALook((prev) => !prev);
    setSubmitSuccess(false);
    setFullName('');
    setEmail('');
    setAgreedToPolicy(false);
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFullName('');
        setEmail('');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMobile = useIsMobile();

  return (
    <>
      <div className="hero hero-mobile-extra w-dvw h-dvh overflow-hidden mx-auto relative">
        {/* Language Toggle Button */}
        <div
          className={cn(
            "absolute top-7 right-7 z-[60] bg-background text-foreground flex items-center justify-center font-medium shadow-2xl overflow-hidden transition-opacity duration-500 border border-foreground/10",
            // Hide on mobile unless reading or having a look
            isMobile && !isReadingMe && !isHavingALook && "opacity-0 pointer-events-none"
          )}
          style={{
            width: isMobile ? '80px' : '100px',
            height: isMobile ? '30px' : '40px',
            borderRadius: '12px',
          }}
        >
          <button
            onClick={() => setLanguage('IT')}
            className={cn(
              'flex-1 h-full transition-all font-display',
              language === 'IT' ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/60'
            )}
          >
            IT
          </button>
          <button
            onClick={() => setLanguage('EN')}
            className={cn(
              'flex-1 h-full transition-all font-display',
              language === 'EN' ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/60'
            )}
          >
            EN
          </button>
        </div>

        <section
          className={cn(
            'h-dvh',
            'min-h-5xl',
            'flex flex-col gap-6 sm:gap-0',
            // 'bg-linear-to-b from-transparent to-foreground/20',
            'relative',
            'p-7',
            'max-w-full',
            'overflow-hidden',
            'justify-center sm:justify-start'
          )}>
          <div className="top w-full relative flex sm:items-center sm:gap-6 max-w-full items-start">
            <span className="flex flex-col mt-0 shrink min-w-0">
              <div className="flex gap-1 sm:gap-1 items-start">
                <h1
                  className="leading-none break-words"
                  style={{
                    fontSize: 'clamp(2rem, 6vw, 8rem)',
                    maxWidth: '100%',
                  }}>
                  David Doro
                  
                </h1>
                {/* <LogoIcon
                  size={80}
                  className="hidden sm:flex sm:mt-5 sm:-ml-2 flex-shrink-0"
                />
                <LogoIcon
                  size={50}
                  className="sm:hidden mt-2 flex-shrink-0"
                /> */}


                <sup className="xl:mt-5 hidden sm:flex"><LogoIcon size={80}/></sup>
                <sup className="xl:mt-5 sm:hidden"><LogoIcon size={50}/></sup>

              </div>
              <h1
                className="sm:text-nowrap leading-none sm:-mt-4 mt-0"
                style={{
                  fontSize: 'clamp(32px, 6vw, 100px)',
                  maxWidth: '100%',
                }}>
                <span
                  className="block sm:inline whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(32px, 6vw, 100px)',
                  }}>
                  Brand{' '}
                  <span
                    className="font-display font-normal"
                    style={{
                      fontSize: 'clamp(32px, 6vw, 100px)',
                    }}>
                    &
                  </span>{' '}
                  Product
                </span>{' '}
                <span
                  className="block sm:inline mt-0"
                  style={{
                    fontSize: 'clamp(32px, 6vw, 100px)',
                    maxWidth: '100%',
                    marginTop: '-10px',
                  }}>
                  Design
                </span>
              </h1>
            </span>

            <Image
              src="/images/ann.svg"
              alt="David Doro"
              width={500}
              height={500}
              className={cn(
                'shaka-image',
                'z-21 sm:h-48 w-auto object-contain shaka-hero shrink-0',
                'transition-all duration-500',
                'max-h-24 sm:max-h-48 ml-auto sm:ml-6',
                isShakaMoved &&
                  'shaka-hero--move absolute left-1/2 right-auto -translate-x-1/2 top-24 sm:opacity-0 sm:pointer-events-none',
                // hide shaka while "Have a look" is active
                isHavingALook && 'opacity-0 pointer-events-none'
              )}
            />
          </div>

          <div className="mid w-full flex-1 min-h-0 flex flex-col sm:flex-row gap-4 sm:gap-10 max-w-full overflow-hidden">
            <div className="relative w-full h-[400px] sm:aspect-9/10 sm:w-auto sm:h-auto sm:max-w-1/3 flex-1 flex-shrink-0">
              <Image
                src="/images/daviddoro.jpg"
                alt="David Doro"
                fill
                className=" object-cover rounded-2xl"
              />
            </div>

            <Button
              variant="link"
              onClick={readMeClick}
              className="sm:hidden w-fit ml-auto italic font-display">
              Read me
            </Button>

            <div className="chapters-and-contact hidden w-full sm:flex sm:flex-1 flex-col justify-between gap-6 min-h-0 overflow-hidden min-w-0 ">
              <div className="chapters w-full flex-1 min-h-0 overflow-hidden">
                {/* <Carousel setApi={setApi} className="w-full h-full">
                  <div
                    className="relative h-full"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const midpoint = rect.width / 2;
                      setHoveredSide(x < midpoint ? 'left' : 'right');
                      setCursorPosition({ x, y });
                    }}
                    onMouseLeave={() => setHoveredSide(null)}>
                    <CarouselContent className="h-full">
                      {Chapters.map((chapter, index) => (
                        <CarouselItem key={index}>
                          <div className="">
                            <h4
                              className="mb-2"
                              style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                              {chapter.title}
                            </h4>
                            <p
                              className="sm:leading-5 md:leading-5 xl:leading-7"
                              style={{ fontSize: 'clamp(14px, 1.5vw, 18px)' }}>
                              {chapter.description}
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselDots api={api} count={Chapters.length} /> */}

                    {/* Single Chapter Display */}
                    <div className="">
                      <h4
                        className="mb-2"
                        style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                        {language === 'IT' ? Chapters[0].title : Chapters[0].titleEN}
                      </h4>
                      <p
                        className="sm:leading-5 md:leading-5 xl:leading-7"
                        style={{ fontSize: 'clamp(14px, 1.5vw, 18px)' }}
                        dangerouslySetInnerHTML={{ __html: language === 'IT' ? Chapters[0].description : Chapters[0].descriptionEN }}>
                      </p>
                    </div>

                    {/* Left arrow */}
                    {/* <button
                      onClick={goToPrevChapter}
                      className={cn(
                        'absolute transition-opacity duration-300',
                        'flex-shrink-0',
                        'opacity-0',
                        hoveredSide === 'left' && 'opacity-100',
                        'disabled:opacity-0 disabled:pointer-events-none',
                        'cursor-pointer'
                      )}
                      style={{
                        left:
                          hoveredSide === 'left'
                            ? `${cursorPosition.x}px`
                            : '1rem',
                        top:
                          hoveredSide === 'left'
                            ? `${cursorPosition.y}px`
                            : '50%',
                        transform:
                          hoveredSide === 'left'
                            ? 'translate(-50%, -50%)'
                            : 'translate(0, -50%)',
                      }}
                      disabled={currentSlide === 0}
                      aria-label="Previous chapter">
                      <Image
                        src="/images/left.svg"
                        alt="Previous"
                        width={40}
                        height={40}
                        className="sm:w-14 sm:h-14"
                        style={{
                          width: 'clamp(30px, 4vw, 56px)',
                          height: 'clamp(30px, 4vw, 56px)',
                        }}
                      />
                    </button> */}

                    {/* Right arrow */}
                    {/* <button
                      onClick={goToNextChapter}
                      className={cn(
                        'absolute transition-opacity duration-300',
                        'flex-shrink-0',
                        'opacity-0',
                        hoveredSide === 'right' && 'opacity-100',
                        'disabled:opacity-0 disabled:pointer-events-none',
                        'cursor-pointer'
                      )}
                      style={{
                        left:
                          hoveredSide === 'right'
                            ? `${cursorPosition.x}px`
                            : 'auto',
                        right: hoveredSide === 'right' ? 'auto' : '1rem',
                        top:
                          hoveredSide === 'right'
                            ? `${cursorPosition.y}px`
                            : '50%',
                        transform:
                          hoveredSide === 'right'
                            ? 'translate(-50%, -50%)'
                            : 'translate(0, -50%)',
                      }}
                      disabled={currentSlide === Chapters.length - 1}
                      aria-label="Next chapter">
                      <Image
                        src="/images/right.svg"
                        alt="Next"
                        width={40}
                        height={40}
                        className="sm:w-14 sm:h-14"
                        style={{
                          width: 'clamp(30px, 4vw, 56px)',
                          height: 'clamp(30px, 4vw, 56px)',
                        }}
                      />
                    </button>
                  </div>
                </Carousel> */}
              </div>

              <div className="contact flex items-end gap-8 justify-between">
                <div className="w-full flex flex-col gap-1">
                  <h4 
                  style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}
                  >{language === 'IT' ? 'Contatti' : 'Contact'}</h4>
                  <Link
                    href="mailto:hello@dorodavid.com"
                    
                    className="sm:leading-5 md:leading-5 xl:leading-7 hover:text-orange-500 w-fit"
                     style={{ fontSize: 'clamp(14px, 1.5vw, 18px)' }}>
                    hello@dorodavid.com
                  </Link>
                  <Link
                    href="https://wa.me/393456366497"
                    className="sm:leading-5 md:leading-5 xl:leading-7 hover:text-orange-500 w-fit"
                     style={{ fontSize: 'clamp(14px, 1.5vw, 18px)' }}>
                    +39 345 636 6497
                  </Link>
                  {/* <Link href="https://www.instagram.com/davesworld__?igsh=ajNwaW5scnQxbHVy" className="hover:text-orange-500 w-fit">
                    Instagram
                  </Link> */}
                  <Link
                    href="/https://www.linkedin.com/in/david-doro-design-industriale/"
                    className="sm:leading-5 md:leading-5 xl:leading-7 hover:text-orange-500 w-fit"
                     style={{ fontSize: 'clamp(14px, 1.5vw, 18px)' }}>
                    LinkedIn
                  </Link>
                </div>

                <Button onClick={haveLookClick}>
                  {language === 'IT' ? "Dai un'occhiata" : 'Have a look'} <ArrowUpRight className="size-8" />
                </Button>
              </div>
            </div>

            <div
              className={cn(
                'bottom w-full flex sm:hidden items-center justify-between gap-4 z-42',
                (isShakaMoved || isHavingALook || isReadingMe) &&
                  'opacity-0 pointer-events-none'
              )}>
              <Button onClick={contactClick} variant="secondary">
                {language === 'IT' ? 'Contatti' : 'Contact'}
              </Button>

              <Button onClick={haveLookClick}>
                {language === 'IT' ? "Dai un'occhiata" : 'Have a look'} <ArrowUpRight className="size-5" />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              'round-stuff',
              'round-text',
              'absolute z-40 top-3/5 sm:top-auto sm:-bottom-56 -left-2 sm:left-auto sm:-right-32 pointer-events-none',
              'transition-all duration-500',
              'sm:max-w-none',
              isShakaMoved && 'round-text--move sm:opacity-0 sm:pointer-events-none',
              (isHavingALook || isReadingMe) && 'opacity-0'
            )}>
            <RoundText
              text="&nbsp;Set Design | Industrial Design | Brand Identity | Web Design | Design Direction | UX&UI | Strategy | "
              size={
                isShakaMoved
                  ? // img-size:moved mobile : desktop
                    isMobile
                    ? 420
                    : 350
                  : // img-size:initial mobile : desktop
                    isMobile
                    ? 540
                    : 500
              }
            />
            {/* {isShakaMoved && (
              <div className="good-things absolute inset-0 flex items-center justify-center text-center">
                <h1 className="text-base sm:text-[52px] font-sans tracking-[0.08em] text-white relative z-40 leading-none px-4 mt-16">
                  Good things take time.
                  <br /> Come back soon
                </h1>
              </div>
            )} */}
          </div>

          <div
            className={cn(
              'mobile-contact-thingie',
              'absolute z-20 left-0 top-0',
              'flex sm:hidden h-dvh w-dvw flex-col justify-end px-6 py-8',
              'bg-foreground',
              'transition-all duration-500',
              isShakaMoved
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            )}>
            <div className="w-full flex flex-col gap-1 *:text-background">
              <h1 className="font-display">{language === 'IT' ? 'Contatti' : 'Contact'}</h1>
              <Link
                className="text-2xl hover:text-orange-500 w-fit"
                href="mailto:hello@dorodavid.com">
                hello@dorodavid.com
              </Link>
              <Link
                className="text-2xl hover:text-orange-500 w-fit"
                href="https://wa.me/393456366497">
                +39 345 636 6497
              </Link>
              {/* <Link
                className="text-2xl"
                href="https://instagram.com/daviddoro.design">
                Instagram
              </Link> */}
              <Link
                className="text-2xl hover:text-orange-500 w-fit"
                href="https://www.linkedin.com/in/david-doro-design-industriale/">
                LinkedIn
              </Link>

              <Button
                variant="outline"
                className="mt-6 hover:bg-background hover:text-foreground "
                onClick={() => setIsShakaMoved(false)}>
                <ArrowLeft />
                {language === 'IT' ? 'Indietro' : 'Back'}
              </Button>
            </div>
          </div>

          <div
            className={cn(
              'mobile-carousel',
              'absolute z-30 left-0 top-0',
              'flex sm:hidden h-dvh w-dvw flex-col justify-between px-6 py-8',
              'transition-all duration-500',
              isReadingMe
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            )}>
            {/* <Carousel setApi={setMobileApi} className="w-full z-31">
              <div className="relative">
                <CarouselContent>
                  {Chapters.map((chapter, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <h4 className="mb-2">{chapter.title}</h4>
                        <p className="">{chapter.description}</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselDots api={mobileApi} count={Chapters.length} /> */}

                {/* Single Chapter Display */}
                <div className="p-1 w-full z-31 mt-8">
                  <h4 className="mb-2">{language === 'IT' ? Chapters[0].title : Chapters[0].titleEN}</h4>
                  <p className="" dangerouslySetInnerHTML={{ __html: language === 'IT' ? Chapters[0].description : Chapters[0].descriptionEN }}></p>
                </div>

                {/* Left hover zone */}
                {/* <div className="absolute left-0 top-0 w-1/4 h-full group z-10 pointer-events-none">
                  <button
                    onClick={goToPrevChapterMobile}
                    className={cn(
                      'absolute left-0 top-1/2 -translate-y-1/2',
                      'flex-shrink-0 transition-all duration-300 pointer-events-auto',
                      'opacity-0',
                      'group-[&_~_div:first-child]:hover:opacity-100',
                      'disabled:opacity-0 disabled:pointer-events-none',
                      'cursor-pointer'
                    )}
                    disabled={mobileCurrentSlide === 0}
                    aria-label="Previous chapter">
                    <Image
                      src="/images/left.svg"
                      alt="Previous"
                      width={40}
                      height={40}
                    />
                  </button>
                </div> */}

                {/* Right hover zone */}
                {/* <div className="absolute right-0 top-0 w-1/4 h-full group z-10 pointer-events-none">
                  <button
                    onClick={goToNextChapterMobile}
                    className={cn(
                      'absolute right-0 top-1/2 -translate-y-1/2',
                      'flex-shrink-0 transition-all duration-300 pointer-events-auto',
                      'opacity-0',
                      'group-[&_~_div:last-child]:hover:opacity-100',
                      'disabled:opacity-0 disabled:pointer-events-none',
                      'cursor-pointer'
                    )}
                    disabled={mobileCurrentSlide === Chapters.length - 1}
                    aria-label="Next chapter">
                    <Image
                      src="/images/right.svg"
                      alt="Next"
                      width={40}
                      height={40}
                    />
                  </button>
                </div>
              </div>
            </Carousel> */}

            <Button
              variant="outline"
              className="mt-6 border-foreground text-foreground z-31 hover:bg-foreground hover:text-background "
              onClick={() => setIsReadingMe(false)}>
              <ArrowLeft />
              {language === 'IT' ? 'Indietro' : 'Back'}
            </Button>
          </div>

          <div
            className={cn(
              'have-a-look-overlay',
              'absolute z-30 left-0 top-0',
              'flex h-dvh w-dvw flex-col items-center justify-end px-6 py-8',
              'transition-all duration-500',
              isHavingALook
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            )}>
            <div className="flex-1 w-full flex flex-col items-center justify-center text-center gap-8 z-800">
              {!submitSuccess ? (
                <>
                  <h1 className="text-base text-[25px] sm:text-[52px] font-sans tracking-[0.08em] text-black relative z-40 leading-none">
                    {language === 'IT' ? (
                      <>
                        Il benfatto <span className="sm:hidden"><br/></span> richiede tempo.
                        <br /> Resta nei paraggi.
                      </>
                    ) : (
                      <>
                        Good things <span className="sm:hidden"><br/></span> take time.
                        <br /> Come back soon
                      </>
                    )}
                  </h1>
                  
                  <div className="w-full max-w-md">
                    <p className="text-lg mb-4 text-foreground">
                      {language === 'IT' ? (
                        <>Curioso di vedere <span className='sm:hidden'><br/></span>i progetti? Lascia la tua email.</>
                      ) : (
                        <>Curious about the projects?<span className='sm:hidden'><br/></span> Leave your email.</>
                      )}
                    </p>
                    <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder={language === 'IT' ? 'Nome Completo' : 'Full Name'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="px-4 py-3  rounded-lg text-foreground bg-background focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder={language === 'IT' ? 'Email' : 'Email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="px-4 py-3  rounded-lg text-foreground bg-background focus:outline-none"
                      />
                      <label className="flex items-start gap-2 text-left text-sm text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreedToPolicy}
                          onChange={(e) => setAgreedToPolicy(e.target.checked)}
                          required
                          className="mt-1 w-4 h-4 flex-shrink-0 cursor-pointer"
                        />
                        <span>
                          {language === 'IT' 
                            ? 'Cliccando su "Tienimi aggiornato", accetto l\'Informativa sulla Privacy e acconsento a ricevere aggiornamenti.'
                            : 'By clicking "Keep me posted", I agree to the Privacy Policy and to receive updates.'
                          }
                        </span>
                      </label>
                      <Button
                        type="submit"
                        variant="orange"
                        disabled={isSubmitting || !agreedToPolicy}>
                        {isSubmitting ? (language === 'IT' ? 'Invio...' : 'Submitting...') : (language === 'IT' ? 'Tienimi aggiornato' : 'Keep me posted')} 
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <h1 className="text-base text-[25px] sm:text-[52px] font-sans tracking-[0.08em] text-black relative z-40 leading-none">
                  {language === 'IT' ? (
                    <>
                      Grazie!
                      <br />
                      Riceverai aggiornamenti <span className='sm:hidden'><br/></span> quando sarà pronto
                    </>
                  ) : (
                    <>
                      Thank you!
                      <br />
                      You will get updates <span className='sm:hidden'><br/></span> when it's ready
                    </>
                  )}
                </h1>
              )}
            </div>
            <Button
              variant="outline"
              className="mt-12 border-foreground text-foreground z-31 w-full hover:bg-foreground hover:text-background "
              onClick={() => setIsHavingALook(false)}>
              <ArrowLeft />
              {language === 'IT' ? 'Indietro' : 'Back'}
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
