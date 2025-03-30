use anchor_lang::prelude::*;
declare_id!("7vdamCBaja8fgtUPzj1nup7qTc6u5F48aFjyMH9PtNgd");
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;
#[program]
pub mod favorites {
    use super::*;
    pub fn set_favorites(context: Context<SetFavorites>, number: u64, color: String) -> Result<()> {
        msg!("Greetings from {}", context.program_id);
        let user_public_key = context.accounts.user.key();
        msg!("User {user_public_key}'s favorite number is {number}, favorite color is: {color}",);

        
        context
            .accounts
            .fav
            .set_inner(FavData { number, color });
        Ok(())
    }
}
// What we will put inside the Fav PDA
#[account]
#[derive(InitSpace)]
pub struct FavData {
    pub number: u64,
    #[max_len(50)]
    pub color: String,
}
#[derive(Accounts)]
pub struct SetFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + FavData::INIT_SPACE,
        seeds=[b"fav", user.key().as_ref()],
        bump
    )]
    pub fav: Account<'info, FavData>,
    pub system_program: Program<'info, System>,
}
