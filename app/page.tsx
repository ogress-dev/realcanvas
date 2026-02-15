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
  }

  const isMobile = useIsMobile();

  return (
    <>
      <div
        className="hero hero-mobile-extra w-dvw h-dvh overflow-hidden mx-auto relative"
      >
        <section
          className={cn(
            'h-dvh',
            'min-h-5xl',
            'flex flex-col gap-6 sm:gap-8',
            // 'bg-linear-to-b from-transparent to-foreground/20',
            'relative',
            'p-7',
            'max-w-full',
            'overflow-hidden',
            'justify-center sm:justify-start',

          )}>
          <div className="top w-full relative flex sm:items-center sm:gap-6 max-w-full">
            <span className="flex flex-col mt-0 shrink min-w-0">
              <div className="flex gap-1 sm:gap-2 items-start flex-wrap">
                <h1
                  className="leading-none break-words"
                  style={{
                    fontSize: 'clamp(2rem, 6vw, 8rem)',
                    maxWidth: '100%'
                  }}
                >
                  David Doro
                </h1>
                <LogoIcon size={90} className="hidden sm:flex sm:mt-2 mt-1 flex-shrink-0" />
                <LogoIcon size={50} className="sm:hidden sm:mt-2 mt-1 flex-shrink-0" />
              </div>
              <h1
  className="sm:text-nowrap break-words leading-tight gap-y-2"
  style={{
    fontSize: 'clamp(32px, 6vw, 100px)',
    maxWidth: '100%'
  }}
>
  Brand{' '}
  <span
    className="font-display font-normal"
    style={{
      fontSize: 'clamp(24px, 4.5vw, 70px)'
    }}
  >
    &
  </span>{' '}
  Product{' '}
  
  <span className="sm:hidden">
    <br />
  </span>

  <span className="block mt-0 sm:inline "
  style={{
    fontSize: 'clamp(32px, 6vw, 100px)',
    maxWidth: '100%',
    marginTop:'-10px'
  }}
  >
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
                'absolute z-21 right-6 top-4/5 sm:static sm:h-48 w-auto object-contain shaka-image shaka-hero flex-shrink-0',
                'transition-all duration-500',
                'max-h-[6rem] sm:max-h-[12rem]',
                isShakaMoved && 'shaka-hero--move',
                isHavingALook &&
                'scale-[200%] right-[33vw] sm:-translate-x-[25vw] top-[40vh] sm:translate-y-[24vh] shaka-wiggle rotate-90 z-31'
              )}
            />
          </div>

          <div className="mid w-full flex-1 min-h-0 flex flex-col sm:flex-row gap-4 sm:gap-10 max-w-full overflow-hidden">
            <div
              className="relative w-full h-[400px] sm:aspect-8/10 sm:w-auto sm:h-auto sm:max-w-1/3 flex-1 flex-shrink-0"

            >
              <Image
                src="/images/daviddoro.jpg"
                alt="David Doro"
                fill
                className="object-cover rounded-2xl"
              />
            </div>

            <Button
              variant="link"
              onClick={readMeClick}
              className="sm:hidden w-fit ml-auto italic font-display">
              Read me
            </Button>

            <div className="chapters-and-contact hidden w-full sm:flex sm:flex-1 flex-col justify-between gap-6 min-h-0 overflow-hidden min-w-0">
              <div className="chapters w-full flex-1 min-h-0 overflow-hidden">
                <Carousel setApi={setApi} className="w-full h-full">
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
                    onMouseLeave={() => setHoveredSide(null)}
                  >
                    <CarouselContent className="h-full">
                      {Chapters.map((chapter, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <h4
                              className="mb-2"
                              style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}
                            >
                              {chapter.title}
                            </h4>
                            <p
                              className="sm:leading-5 md:leading-5 xl:leading-8"
                              style={{ fontSize: 'clamp(14px, 1.5vw, 18px)' }}
                            >
                              {chapter.description}
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselDots api={api} count={Chapters.length} />

                    {/* Left arrow */}
                    <button
                      onClick={goToPrevChapter}
                      className={cn(
                        "absolute transition-all duration-300",
                        "flex-shrink-0",
                        "opacity-0",
                        hoveredSide === 'left' && "opacity-100",
                        "disabled:opacity-0 disabled:pointer-events-none",
                        "cursor-pointer"
                      )}
                      style={{
                        left: hoveredSide === 'left' ? `${cursorPosition.x}px` : '1rem',
                        top: hoveredSide === 'left' ? `${cursorPosition.y}px` : '50%',
                        transform: hoveredSide === 'left'
                          ? 'translate(-50%, -50%)'
                          : 'translate(0, -50%)'
                      }}
                      disabled={currentSlide === 0}
                      aria-label="Previous chapter"
                    >
                      <Image
                        src="/images/left.svg"
                        alt="Previous"
                        width={40}
                        height={40}
                        className="sm:w-14 sm:h-14"
                        style={{
                          width: 'clamp(30px, 4vw, 56px)',
                          height: 'clamp(30px, 4vw, 56px)'
                        }}
                      />
                    </button>

                    {/* Right arrow */}
                    <button
                      onClick={goToNextChapter}
                      className={cn(
                        "absolute transition-all duration-300",
                        "flex-shrink-0",
                        "opacity-0",
                        hoveredSide === 'right' && "opacity-100",
                        "disabled:opacity-0 disabled:pointer-events-none",
                        "cursor-pointer"
                      )}
                      style={{
                        left: hoveredSide === 'right' ? `${cursorPosition.x}px` : 'auto',
                        right: hoveredSide === 'right' ? 'auto' : '1rem',
                        top: hoveredSide === 'right' ? `${cursorPosition.y}px` : '50%',
                        transform: hoveredSide === 'right'
                          ? 'translate(-50%, -50%)'
                          : 'translate(0, -50%)'
                      }}
                      disabled={currentSlide === Chapters.length - 1}
                      aria-label="Next chapter"
                    >
                      <Image
                        src="/images/right.svg"
                        alt="Next"
                        width={40}
                        height={40}
                        className="sm:w-14 sm:h-14"
                        style={{
                          width: 'clamp(30px, 4vw, 56px)',
                          height: 'clamp(30px, 4vw, 56px)'
                        }}
                      />
                    </button>
                  </div>
                </Carousel>
              </div>

              <div className="contact flex items-end gap-8 justify-between">
                <div className="w-full flex flex-col gap-1">
                  <h4>Contact</h4>
                  <Link href="mailto:hello@dorodavid.com" className="hover:text-orange-500 w-fit">
                    hello@dorodavid.com
                  </Link>
                  <Link href="tel:+393456366497" className="hover:text-orange-500 w-fit">+39 345 636 6497</Link>
                  {/* <Link href="https://www.instagram.com/davesworld__?igsh=ajNwaW5scnQxbHVy" className="hover:text-orange-500 w-fit">
                    Instagram
                  </Link> */}
                  <Link href="/https://www.linkedin.com/in/david-doro-design-industriale/" className="hover:text-orange-500 w-fit">
                    LinkedIn
                  </Link>
                </div>

                <Button onClick={haveLookClick}>
                  Have a look <ArrowUpRight className="size-8" />
                </Button>
              </div>
            </div>

            <div className={cn(
              'bottom w-full flex sm:hidden items-center justify-between gap-4 z-42',
              (isShakaMoved || isHavingALook || isReadingMe) && 'opacity-0 pointer-events-none'
            )}>
              <Button onClick={contactClick} variant="secondary">
                Contact
              </Button>

              <Button onClick={haveLookClick}>
                Have a look <ArrowUpRight className="size-5" />
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
              isShakaMoved && 'round-text--move',
              (isHavingALook || isReadingMe) && 'opacity-0'
            )}>
            <RoundText
              text="Set design | industrial design | Brand Identity | Web Design | Photography | Design Direction | UX&UI | Strategy |"
              size={isShakaMoved
                // img-size:moved mobile : desktop
                ? isMobile ? 400 : 400
                // img-size:initial mobile : desktop
                : isMobile ? 540 : 500
              }
            />
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
              <h1 className="font-display">Contact</h1>
              <Link className="text-2xl" href="mailto:hello@dorodavid.com">
                hello@dorodavid.com
              </Link>
              <Link className="text-2xl" href="tel:+393456366497">
                +39 345 636 6497
              </Link>
              {/* <Link
                className="text-2xl"
                href="https://instagram.com/daviddoro.design">
                Instagram
              </Link> */}
              <Link
                className="text-2xl"
                href="https://www.linkedin.com/in/david-doro-design-industriale/">
                LinkedIn
              </Link>

              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setIsShakaMoved(false)}>
                <ArrowLeft />
                Back
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
            <Carousel setApi={setMobileApi} className="w-full z-31">
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
                <CarouselDots api={mobileApi} count={Chapters.length} />

                {/* Left hover zone */}
                <div className="absolute left-0 top-0 w-1/4 h-full group z-10 pointer-events-none">
                  <button
                    onClick={goToPrevChapterMobile}
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2",
                      "flex-shrink-0 transition-all duration-300 pointer-events-auto",
                      "opacity-0",
                      "group-[&_~_div:first-child]:hover:opacity-100",
                      "disabled:opacity-0 disabled:pointer-events-none",
                      "cursor-pointer"
                    )}
                    disabled={mobileCurrentSlide === 0}
                    aria-label="Previous chapter"
                  >
                    <Image
                      src="/images/left.svg"
                      alt="Previous"
                      width={40}
                      height={40}
                    />
                  </button>
                </div>

                {/* Right hover zone */}
                <div className="absolute right-0 top-0 w-1/4 h-full group z-10 pointer-events-none">
                  <button
                    onClick={goToNextChapterMobile}
                    className={cn(
                      "absolute right-0 top-1/2 -translate-y-1/2",
                      "flex-shrink-0 transition-all duration-300 pointer-events-auto",
                      "opacity-0",
                      "group-[&_~_div:last-child]:hover:opacity-100",
                      "disabled:opacity-0 disabled:pointer-events-none",
                      "cursor-pointer"
                    )}
                    disabled={mobileCurrentSlide === Chapters.length - 1}
                    aria-label="Next chapter"
                  >
                    <Image
                      src="/images/right.svg"
                      alt="Next"
                      width={40}
                      height={40}
                    />
                  </button>
                </div>
              </div>
            </Carousel>

            <Button
              variant="outline"
              className="mt-6 border-foreground text-foreground z-31"
              onClick={() => setIsReadingMe(false)}>
              <ArrowLeft />
              Back
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
            <Button
              variant="outline"
              className="mt-12 border-foreground text-foreground z-31 w-full"
              onClick={() => setIsHavingALook(false)}>
              <ArrowLeft />
              Back
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
