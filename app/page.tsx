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
  const [isShakaMoved, setIsShakaMoved] = useState(false);
  const [isReadingMe, setIsReadingMe] = useState(false);
  const [isHavingALook, setIsHavingALook] = useState(false);

  function contactClick() {
    setIsShakaMoved((prev) => !prev);
  }

  function readMeClick() {
    setIsReadingMe((prev) => !prev);
  }

  function haveLookClick() {
    setIsHavingALook((prev) => !prev);
  }

  return (
    <>
      <div className="hero w-dvw h-dvh overflow-hidden mx-auto">
        <section
          className={cn(
            'h-dvh',
            'flex flex-col gap-6 sm:gap-8',
            'bg-linear-to-b from-transparent to-foreground/20',
            'relative',
            'p-10', 
            
          )}>
          <div className="top w-full relative flex sm:items-center sm:gap-6">
            <span className="flex flex-col mt-0">
              <div className="flex gap-1 sm:gap-2 items-start">
                <h1 className="sm:text-[112px] text-[40px] leading-none">David Doro</h1> 
                <LogoIcon size={50} className="sm:mt-2 mt-1" />
              </div>
              <h1 className="sm:text-nowrap text-[40px] sm:text-[112px] whitespace-nowrap">
                Brand{' '}
                <span className="font-display text-5xl sm:text-8xl md:text-8xl font-normal">
                  &
                </span>{' '}
                Product
                <span className="sm:hidden">
                  <br />
                </span>
                Design
              </h1>

            </span>

            <Image
              src="/images/shaka.png"
              alt="David Doro"
              width={500}
              height={500}
              className={cn(
                'absolute z-21 right-0 top-4/5 sm:static h-26 sm:h-48 w-fit object-contain shaka-image shaka-hero',
                'transition-all duration-500',
                isShakaMoved && 'shaka-hero--move',
                isHavingALook &&
                'scale-[300%] right-[33vw] sm:-translate-x-[18vw] top-[40vh] sm:translate-y-[24vh] shaka-wiggle rotate-90 z-31'
              )}
            />
          </div>

          <div className="mid w-full flex-1 min-h-0 flex flex-col sm:flex-row gap-4 sm:gap-10">
            <div className="relative w-[327px] h-[400px] sm:aspect-8/10 sm:w-auto sm:h-auto sm:max-w-1/3 flex-1">
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

            <div className="chapters-and-contact hidden w-full sm:flex sm:flex-1 flex-col justify-between gap-6 min-h-0 overflow-hidden">
              <div className="chapters w-full flex-1 min-h-0">
                <Carousel setApi={setApi} className="w-full">
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
                  <CarouselDots api={api} count={Chapters.length} />
                </Carousel>
              </div>

              <div className="contact flex items-end gap-8 justify-between">
                <div className="w-full flex flex-col gap-1">
                  <h4>Contact</h4>
                  <Link href="mailto:hello@dorodavid.com">
                    hello@dorodavid.com
                  </Link>
                  <Link href="tel:+393456366497">+39 345 636 6497</Link>
                  <Link href="https://instagram.com/daviddoro.design">
                    Instagram
                  </Link>
                  <Link href="https://www.linkedin.com/in/daviddoro/">
                    LinkedIn
                  </Link>
                </div>

                <Button onClick={haveLookClick}>
                  Have a look <ArrowUpRight />
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
              isShakaMoved && 'round-text--move',
              (isHavingALook || isReadingMe) && 'opacity-0'
            )}>
            <RoundText
              text="Set design | industrial design | Brand Identity | Web Design | Photography | Design Direction | UX&UI | Strategy |"
              size={isShakaMoved ? 470 : 540}
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
              <Link
                className="text-2xl"
                href="https://instagram.com/daviddoro.design">
                Instagram
              </Link>
              <Link
                className="text-2xl"
                href="https://www.linkedin.com/in/daviddoro/">
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
            <Carousel setApi={setApi} className="w-full z-31">
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
              <CarouselDots api={api} count={Chapters.length} />
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
