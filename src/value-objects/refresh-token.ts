import { Consts } from '../consts';
import { JwTokenHelper } from '../helpers/jwtoken-helper';
import { ValueObject } from './value-object-base';

interface RefreshTokenProps {
  value: string;
}

export class RefreshToken extends ValueObject<RefreshTokenProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: RefreshTokenProps) {
    super(props);
  }

  public getExpNounce(): number {
    return JwTokenHelper.getTokenExpNounce(this.value);
  }

  public validate() {
    JwTokenHelper.validateToken(this.value);
  }

  public static generate(): RefreshToken {
    return new RefreshToken({
      value: JwTokenHelper.generateJWToken(
        {},
        Consts.REFRESH_TOKEN_EXPIRATION_IN_SECONDS
      )
    });
  }

  public static generateWithExpNounceFrom(oldValue: RefreshToken) {
    return new RefreshToken({
      value: JwTokenHelper.generateJWTokenWithExpirationNounce(
        {},
        oldValue.getExpNounce()
      )
    });
  }

  public static create(value: string): RefreshToken {
    return new RefreshToken({ value: value });
  }
}
