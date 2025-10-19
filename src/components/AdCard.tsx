import { motion } from 'framer-motion'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { ExternalLink, Star } from 'lucide-react'

interface AdCardProps {
  ad: {
    id: string
    title: string
    description: string
    image_url?: string
    cta_text: string
    cta_url: string
  }
}

export function AdCard({ ad }: AdCardProps) {
  const handleClick = () => {
    if (ad.cta_url.startsWith('mailto:')) {
      window.location.href = ad.cta_url
    } else {
      window.open(ad.cta_url, '_blank')
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/30 shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-6 relative">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                  {ad.title}
                </h3>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-medium">
                  Sponsored
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                {ad.description}
              </p>
              
              {ad.image_url && (
                <div className="mb-6">
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-40 object-cover rounded-xl border border-purple-500/20 shadow-md"
                  />
                </div>
              )}

              <Button
                onClick={handleClick}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                <span className="text-base">{ad.cta_text}</span>
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}