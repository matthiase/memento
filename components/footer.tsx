import { buttonVariants } from '@/components/ui/button'
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon
} from '@radix-ui/react-icons'
import Link from 'next/link'

export function Footer(props: {
  builtBy: string
  builtByLink: string
  githubLink: string
  twitterLink: string
  linkedinLink: string
}) {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex max-w-screen-2xl items-center justify-between gap-4 py-10 md:h-24 md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a
              href={props.builtByLink}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {props.builtBy}
            </a>
            . The source code is available on{' '}
            <a
              href={props.githubLink}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        <div className="flex items-center space-x-1">
          {(
            [
              {
                key: 'twitter',
                href: props.twitterLink,
                icon: TwitterLogoIcon
              },
              {
                key: 'linkedIn',
                href: props.linkedinLink,
                icon: LinkedInLogoIcon
              },
              { key: 'Github', href: props.githubLink, icon: GitHubLogoIcon }
            ] as const
          ).map(link => (
            <Link
              key={link.key}
              href={link.href}
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            >
              <link.icon className="h-6 w-6" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
