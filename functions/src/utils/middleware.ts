import { Request, Response, NextFunction } from "express"

// currently only applies to district and school
const formatDocumentPaths = ({ body }: Request, _response: Response, next: NextFunction) => {
  const district: string | undefined = body.district
  const school: string | undefined = body.school
  if (district) {
    if (!district.startsWith('districts/')) {
      body.district = `districts/${body.district}`
    }
    if (school && !school.startsWith('districts/')) {
      body.school = `${body.districts}schools/${body.school}`
    }
  } else if (school) {
    if (school.startsWith('districts/')) {
      body.district = (body.school as string).split('/schools/')[ 0 ]
    } else {
      // Only the school ID was specified. A separate search query should be made
      body.school = undefined
    }
  }
  next()
}

export default {
  formatDocumentPaths
}